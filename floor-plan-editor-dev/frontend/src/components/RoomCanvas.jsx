import React, { useRef, useEffect, useState } from 'react'
import { useDrop } from 'react-dnd'
import { fabric } from 'fabric'
import { useEditorStore } from '../store/editorStore'

const RoomCanvas = ({ activeDrawingTool, setActiveDrawingTool }) => {
  const canvasRef = useRef(null)
  const fabricCanvasRef = useRef(null)
  const drawingRef = useRef({ isDrawing: false, startPoint: null })
  const activeDrawingToolRef = useRef(activeDrawingTool)
  
  // Update ref when activeDrawingTool changes
  useEffect(() => {
    activeDrawingToolRef.current = activeDrawingTool
  }, [activeDrawingTool])

  // ESC key to cancel drawing
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && activeDrawingTool === 'draw') {
        // Cancel drawing mode
        if (drawingRef.current.isDrawing && drawingRef.current.tempLine) {
          fabricCanvasRef.current?.remove(drawingRef.current.tempLine)
          drawingRef.current.isDrawing = false
          drawingRef.current.tempLine = null
          fabricCanvasRef.current?.renderAll()
        }
        setActiveDrawingTool('select')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeDrawingTool, setActiveDrawingTool])
  
  const { 
    elements, 
    roomElements = [],
    selectedElement,
    addElement, 
    addRoomElement,
    updateElement, 
    setSelectedElement, 
    setCanvas,
    zoom,
    gridEnabled,
    gridSize,
    snapToGrid
  } = useEditorStore()

  const [rooms, setRooms] = useState([])
  const [selectedRoom, setSelectedRoom] = useState(null)

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['element', 'roomElement'],
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset()
      if (offset && fabricCanvasRef.current) {
        const canvasRect = fabricCanvasRef.current.getElement().getBoundingClientRect()
        const x = offset.x - canvasRect.left
        const y = offset.y - canvasRect.top
        
        if (item.elementType.category === 'room') {
          handleAddRoomElement(item.elementType, x, y)
        } else {
          handleAddElement(item.elementType, x, y)
        }
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }))

  useEffect(() => {
    if (canvasRef.current && !fabricCanvasRef.current) {
      const canvas = new fabric.Canvas(canvasRef.current, {
        width: 800,
        height: 600,
        backgroundColor: '#ffffff',
        selection: true,
        snapAngle: 15,
        snapThreshold: 10
      })

      fabricCanvasRef.current = canvas
      setCanvas(canvas)

      // Canvas event handlers
      setupCanvasEvents(canvas)

      // Drawing grid
      if (gridEnabled) {
        drawGrid(canvas)
      }

      return () => {
        canvas.dispose()
      }
    }
  }, [setCanvas, setSelectedElement, updateElement, gridEnabled, gridSize])

  const setupCanvasEvents = (canvas) => {
    // Selection events
    canvas.on('selection:created', (e) => {
      if (e.selected && e.selected[0]) {
        setSelectedElement(e.selected[0])
      }
    })

    canvas.on('selection:updated', (e) => {
      if (e.selected && e.selected[0]) {
        setSelectedElement(e.selected[0])
      }
    })

    canvas.on('selection:cleared', () => {
      setSelectedElement(null)
    })

    // Object modification
    canvas.on('object:modified', (e) => {
      const obj = e.target
      if (obj && obj.elementId) {
        updateElement(obj.elementId, {
          left: obj.left,
          top: obj.top,
          scaleX: obj.scaleX,
          scaleY: obj.scaleY,
          angle: obj.angle
        })
      }
    })

    // Snap to grid during movement
    canvas.on('object:moving', (e) => {
      const obj = e.target
      if (snapToGrid && obj) {
        obj.set({
          left: Math.round(obj.left / gridSize) * gridSize,
          top: Math.round(obj.top / gridSize) * gridSize
        })
      }
    })

    // Mouse wheel zoom
    canvas.on('mouse:wheel', (opt) => {
      const delta = opt.e.deltaY
      let newZoom = canvas.getZoom()
      newZoom *= 0.999 ** delta
      
      // Limit zoom range: 10% - 500%
      if (newZoom > 5) newZoom = 5
      if (newZoom < 0.1) newZoom = 0.1
      
      canvas.setZoom(newZoom)
      
      // Update store zoom value
      const zoomPercent = Math.round(newZoom * 100)
      useEditorStore.setState({ zoom: zoomPercent })
      
      opt.e.preventDefault()
      opt.e.stopPropagation()
    })

    // Drawing events for wall tool
    canvas.on('mouse:down', (e) => {
      if (activeDrawingToolRef.current === 'draw') {
        handleDrawingStart(e, canvas)
      }
    })

    canvas.on('mouse:move', (e) => {
      if (activeDrawingToolRef.current === 'draw' && drawingRef.current.isDrawing) {
        handleDrawingMove(e, canvas)
      }
    })

    canvas.on('mouse:up', (e) => {
      if (activeDrawingToolRef.current === 'draw') {
        handleDrawingEnd(e, canvas)
      }
    })
  }

  const handleDrawingStart = (e, canvas) => {
    const pointer = canvas.getPointer(e.e)
    drawingRef.current.isDrawing = true
    drawingRef.current.startPoint = pointer

    // Create temporary line for preview
    const line = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
      stroke: '#374151',
      strokeWidth: 10,
      selectable: false,
      evented: false,
      opacity: 0.7,
      id: 'temp-wall'
    })
    
    canvas.add(line)
    drawingRef.current.tempLine = line
  }

  const handleDrawingMove = (e, canvas) => {
    if (!drawingRef.current.tempLine) return
    
    const pointer = canvas.getPointer(e.e)
    const startPoint = drawingRef.current.startPoint
    
    // Remove old ghost lines
    ghostLinesRef.current.forEach(line => canvas.remove(line))
    ghostLinesRef.current = []
    
    // Collect all existing points (wall endpoints and corners)
    const existingPoints = []
    canvas.getObjects().forEach(obj => {
      if (obj.elementType === 'wall' && obj.type === 'line') {
        existingPoints.push({ x: obj.x1, y: obj.y1 })
        existingPoints.push({ x: obj.x2, y: obj.y2 })
      }
    })
    
    // Check for horizontal/vertical alignment (within 5px tolerance)
    const snapTolerance = 5
    existingPoints.forEach(point => {
      // Horizontal alignment
      if (Math.abs(pointer.y - point.y) < snapTolerance) {
        const ghostLine = new fabric.Line([0, point.y, canvas.width, point.y], {
          stroke: '#3b82f6',
          strokeWidth: 1,
          strokeDashArray: [5, 5],
          selectable: false,
          evented: false,
          opacity: 0.5,
          id: 'ghost-line'
        })
        canvas.add(ghostLine)
        ghostLinesRef.current.push(ghostLine)
      }
      
      // Vertical alignment
      if (Math.abs(pointer.x - point.x) < snapTolerance) {
        const ghostLine = new fabric.Line([point.x, 0, point.x, canvas.height], {
          stroke: '#3b82f6',
          strokeWidth: 1,
          strokeDashArray: [5, 5],
          selectable: false,
          evented: false,
          opacity: 0.5,
          id: 'ghost-line'
        })
        canvas.add(ghostLine)
        ghostLinesRef.current.push(ghostLine)
      }
    })
    
    // Calculate angle and snap to 45° increments
    let dx = pointer.x - startPoint.x
    let dy = pointer.y - startPoint.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    if (distance > 0) {
      let angle = Math.atan2(dy, dx) * 180 / Math.PI
      // Snap to nearest 45°
      const snapAngle = Math.round(angle / 45) * 45
      const snapRad = snapAngle * Math.PI / 180
      
      // Calculate snapped endpoint
      const snappedX = startPoint.x + distance * Math.cos(snapRad)
      const snappedY = startPoint.y + distance * Math.sin(snapRad)
      
      drawingRef.current.tempLine.set({
        x2: snappedX,
        y2: snappedY
      })
    }
    canvas.renderAll()
  }

  const handleDrawingEnd = (e, canvas) => {
    if (!drawingRef.current.isDrawing || !drawingRef.current.tempLine) return

    const tempLine = drawingRef.current.tempLine
    const startPoint = drawingRef.current.startPoint
    
    // Use snapped coordinates from temp line
    const endX = tempLine.x2
    const endY = tempLine.y2

    // Remove temporary line and ghost lines
    canvas.remove(tempLine)
    ghostLinesRef.current.forEach(line => canvas.remove(line))
    ghostLinesRef.current = []

    // Calculate distance to ensure meaningful walls
    const distance = Math.sqrt(
      Math.pow(endX - startPoint.x, 2) + Math.pow(endY - startPoint.y, 2)
    )

    if (distance > 20) {
      // Create permanent wall with snapped coordinates
      const wall = new fabric.Line([startPoint.x, startPoint.y, endX, endY], {
        stroke: '#374151',
        strokeWidth: 10,
        selectable: true,
        evented: true,
        opacity: 1,
        elementId: Date.now().toString(),
        elementType: 'wall'
      })

      canvas.add(wall)
      
      // Add to store
      const wallElement = {
        id: wall.elementId,
        type: 'wall',
        name: 'Ściana',
        x1: startPoint.x,
        y1: startPoint.y,
        x2: endX,
        y2: endY,
        color: '#374151',
        strokeWidth: 10
      }

      addRoomElement(wallElement)

      // Ciągłe rysowanie - nowy początek od końca poprzedniej ściany (snapped)
      drawingRef.current.startPoint = { x: endX, y: endY }
      
      // Create new temporary line for next wall
      const newLine = new fabric.Line([endX, endY, endX, endY], {
        stroke: '#374151',
        strokeWidth: 10,
        selectable: false,
        evented: false,
        opacity: 0.7,
        id: 'temp-wall'
      })

      canvas.add(newLine)
      drawingRef.current.tempLine = newLine
      // Keep isDrawing true for continuous drawing
    } else {
      // If wall too short, stop drawing
      drawingRef.current.isDrawing = false
      drawingRef.current.startPoint = null
      drawingRef.current.tempLine = null
    }

    canvas.renderAll()
  }

  const handleAddRoomElement = (elementType, x, y) => {
    if (!fabricCanvasRef.current) return

    // Snap to grid if enabled
    if (snapToGrid) {
      x = Math.round(x / gridSize) * gridSize
      y = Math.round(y / gridSize) * gridSize
    }

    const element = {
      type: elementType.type,
      name: elementType.name,
      left: x,
      top: y,
      ...elementType.defaultProps
    }

    let fabricObject

    switch (elementType.type) {
      case 'wall':
        fabricObject = new fabric.Rect({
          width: element.width,
          height: element.height,
          fill: element.color,
          left: x,
          top: y,
          stroke: element.color,
          strokeWidth: element.strokeWidth
        })
        break

      case 'door':
        fabricObject = new fabric.Group([
          new fabric.Rect({
            width: element.width,
            height: element.height,
            fill: element.color,
            stroke: '#000000',
            strokeWidth: 1
          }),
          new fabric.Path('M 10 5 Q 10 0 20 0 Q 30 0 30 5', {
            fill: 'transparent',
            stroke: '#000000',
            strokeWidth: 1,
            left: 15,
            top: -5
          })
        ], {
          left: x,
          top: y
        })
        break

      case 'window':
        fabricObject = new fabric.Group([
          new fabric.Rect({
            width: element.width,
            height: element.height,
            fill: '#e0f2fe',
            stroke: element.color,
            strokeWidth: element.strokeWidth
          }),
          new fabric.Line([0, element.height/2, element.width, element.height/2], {
            stroke: element.color,
            strokeWidth: 1
          })
        ], {
          left: x,
          top: y
        })
        break

      case 'room':
        fabricObject = new fabric.Rect({
          width: element.width,
          height: element.height,
          fill: element.fill,
          stroke: element.stroke,
          strokeWidth: element.strokeWidth,
          left: x,
          top: y,
          rx: 5,
          ry: 5
        })
        break

      case 'zone':
        fabricObject = new fabric.Rect({
          width: element.width,
          height: element.height,
          fill: element.fill,
          stroke: element.stroke,
          strokeWidth: element.strokeWidth,
          left: x,
          top: y,
          rx: 4,
          ry: 4,
          cornerStyle: 'circle',
          cornerColor: '#f59e0b',
          cornerSize: 10,
          transparentCorners: false,
          hasControls: true,
          hasBorders: true
        })
        break

      default:
        fabricObject = new fabric.Rect({
          width: element.width,
          height: element.height,
          fill: element.color,
          left: x,
          top: y
        })
    }

    fabricObject.elementId = Date.now().toString()
    element.id = fabricObject.elementId

    fabricCanvasRef.current.add(fabricObject)
    fabricCanvasRef.current.setActiveObject(fabricObject)
    fabricCanvasRef.current.renderAll()

    addRoomElement(element)
    setSelectedElement(fabricObject)
  }

  const handleAddElement = (elementType, x, y) => {
    // Same as original Canvas component
    if (!fabricCanvasRef.current) return

    // Snap to grid if enabled
    if (snapToGrid) {
      x = Math.round(x / gridSize) * gridSize
      y = Math.round(y / gridSize) * gridSize
    }

    const element = {
      type: elementType.type,
      name: elementType.name,
      left: x,
      top: y,
      ...elementType.defaultProps
    }

    let fabricObject

    switch (elementType.type) {
      case 'sensor': {
        const circle = new fabric.Circle({
          radius: element.width / 2,
          fill: element.color,
          left: x,
          top: y - 8,
          originX: 'center',
          originY: 'center',
          selectable: true
        })

        const label = new fabric.Text(element.name || 'Czujnik', {
          left: x,
          top: y + (element.width / 2) - 2,
          originX: 'center',
          originY: 'center',
          fontSize: 12,
          fill: '#374151',
          selectable: false
        })

        fabricObject = new fabric.Group([circle, label], {
          left: x,
          top: y,
          originX: 'center',
          originY: 'center'
        })
        break
      }
      case 'light':
      case 'switch':
      case 'camera':
      case 'speaker':
        fabricObject = new fabric.Circle({
          radius: element.width / 2,
          fill: element.color,
          left: x,
          top: y,
          originX: 'center',
          originY: 'center'
        })
        break
      default:
        fabricObject = new fabric.Rect({
          width: element.width,
          height: element.height,
          fill: element.color,
          left: x,
          top: y
        })
    }

    fabricObject.elementId = Date.now().toString()
    element.id = fabricObject.elementId

    fabricCanvasRef.current.add(fabricObject)
    fabricCanvasRef.current.setActiveObject(fabricObject)
    fabricCanvasRef.current.renderAll()

    addElement(element)
    setSelectedElement(fabricObject)
  }

  const handleBackgroundImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      fabric.Image.fromURL(event.target.result, (img) => {
        const canvas = fabricCanvasRef.current
        if (!canvas) return

        // Scale image to fit canvas
        const scaleX = canvas.width / img.width
        const scaleY = canvas.height / img.height
        const scale = Math.min(scaleX, scaleY)

        img.set({
          scaleX: scale,
          scaleY: scale,
          selectable: false,
          evented: false,
          opacity: 0.5,
          id: 'background-image'
        })

        // Remove existing background image
        if (backgroundImageRef.current) {
          canvas.remove(backgroundImageRef.current)
        }

        canvas.add(img)
        canvas.sendToBack(img)
        backgroundImageRef.current = img
        canvas.renderAll()
      })
    }
    reader.readAsDataURL(file)
  }

  const drawGrid = (canvas) => {
    const width = canvas.getWidth()
    const height = canvas.getHeight()
    
    // Clear existing grid
    const objects = canvas.getObjects().filter(obj => obj.isGrid)
    objects.forEach(obj => canvas.remove(obj))

    // Draw vertical lines
    for (let i = 0; i <= width; i += gridSize) {
      const line = new fabric.Line([i, 0, i, height], {
        stroke: '#e5e7eb',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        isGrid: true
      })
      canvas.add(line)
      canvas.sendToBack(line)
    }

    // Draw horizontal lines
    for (let i = 0; i <= height; i += gridSize) {
      const line = new fabric.Line([0, i, width, i], {
        stroke: '#e5e7eb',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        isGrid: true
      })
      canvas.add(line)
      canvas.sendToBack(line)
    }

    canvas.renderAll()
  }

  useEffect(() => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.setZoom(zoom / 100)
      fabricCanvasRef.current.renderAll()
    }
  }, [zoom])

  return (
    <div className="flex-1 p-4">
      {/* Tool status */}
      {activeDrawingTool === 'draw' && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-blue-700">Tryb rysowania ścian</span>
            </div>
            <button
              onClick={() => setActiveDrawingTool('select')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Zakończ rysowanie
            </button>
          </div>
          <p className="text-xs text-blue-600 mt-1">
            Kliknij i przeciągnij aby narysować ścianę • Niebieskie linie = wyrównanie • ESC = anuluj
          </p>
        </div>
      )}

      <div className="canvas-container" ref={drop}>
        <canvas
          ref={canvasRef}
          className={`border-2 ${
            isOver 
              ? 'border-blue-400 bg-blue-50' 
              : activeDrawingTool === 'draw'
              ? 'border-green-400 cursor-crosshair'
              : 'border-gray-300'
          }`}
        />
        
        {isOver && (
          <div className="absolute inset-0 bg-blue-100 bg-opacity-50 flex items-center justify-center">
            <div className="text-blue-600 font-medium">
              Upuść element tutaj
            </div>
          </div>
        )}
      </div>
      
      {/* Canvas controls */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="px-3 py-1 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded cursor-pointer transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleBackgroundImageUpload}
                className="hidden"
              />
              📷 Tło
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Zoom:</span>
            <span className="text-sm font-medium">{zoom}%</span>
            <button
              onClick={() => {
                if (fabricCanvasRef.current) {
                  fabricCanvasRef.current.setZoom(1)
                  useEditorStore.setState({ zoom: 100 })
                  fabricCanvasRef.current.renderAll()
                }
              }}
              className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded transition-colors"
              title="Reset zoom (100%)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </button>
          </div> {/* Close zoom section */}
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={gridEnabled}
              onChange={(e) => {
                const enabled = e.target.checked
                if (fabricCanvasRef.current) {
                  if (enabled) {
                    drawGrid(fabricCanvasRef.current)
                  } else {
                    const objects = fabricCanvasRef.current.getObjects().filter(obj => obj.isGrid)
                    objects.forEach(obj => fabricCanvasRef.current.remove(obj))
                    fabricCanvasRef.current.renderAll()
                  }
                }
              }}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-600">Siatka</span>
          </div>
        </div>

        <div className="text-sm text-gray-500">
          Pomieszczenia: {rooms.length} | Elementy: {elements.length}
        </div>
      </div>
    </div>
  )
} // Close RoomCanvas component

export default RoomCanvas