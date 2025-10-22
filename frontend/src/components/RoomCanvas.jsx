import React, { useRef, useEffect, useState } from 'react'
import { useDrop } from 'react-dnd'
import { fabric } from 'fabric'
import { useEditorStore } from '../store/editorStore'

const RoomCanvas = ({ activeDrawingTool, setActiveDrawingTool }) => {
  const canvasRef = useRef(null)
  const fabricCanvasRef = useRef(null)
  const drawingRef = useRef({ isDrawing: false, startPoint: null })
  
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
    gridSize
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

    // Drawing events for wall tool
    canvas.on('mouse:down', (e) => {
      if (activeDrawingTool === 'draw') {
        handleDrawingStart(e, canvas)
      }
    })

    canvas.on('mouse:move', (e) => {
      if (activeDrawingTool === 'draw' && drawingRef.current.isDrawing) {
        handleDrawingMove(e, canvas)
      }
    })

    canvas.on('mouse:up', (e) => {
      if (activeDrawingTool === 'draw') {
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
    canvas.renderAll()
  }

  const handleDrawingMove = (e, canvas) => {
    if (!drawingRef.current.isDrawing || !drawingRef.current.tempLine) return

    const pointer = canvas.getPointer(e.e)
    const line = drawingRef.current.tempLine

    line.set({
      x2: pointer.x,
      y2: pointer.y
    })

    canvas.renderAll()
  }

  const handleDrawingEnd = (e, canvas) => {
    if (!drawingRef.current.isDrawing || !drawingRef.current.tempLine) return

    const pointer = canvas.getPointer(e.e)
    const startPoint = drawingRef.current.startPoint

    // Remove temporary line
    canvas.remove(drawingRef.current.tempLine)

    // Calculate distance to ensure meaningful walls
    const distance = Math.sqrt(
      Math.pow(pointer.x - startPoint.x, 2) + Math.pow(pointer.y - startPoint.y, 2)
    )

    if (distance > 20) {
      // Create permanent wall
      const wall = new fabric.Line([startPoint.x, startPoint.y, pointer.x, pointer.y], {
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
        x2: pointer.x,
        y2: pointer.y,
        color: '#374151',
        strokeWidth: 10
      }

      addRoomElement(wallElement)
    }

    // Reset drawing state
    drawingRef.current.isDrawing = false
    drawingRef.current.startPoint = null
    drawingRef.current.tempLine = null

    canvas.renderAll()
  }

  const handleAddRoomElement = (elementType, x, y) => {
    if (!fabricCanvasRef.current) return

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

    const element = {
      type: elementType.type,
      name: elementType.name,
      left: x,
      top: y,
      ...elementType.defaultProps
    }

    let fabricObject
    
    switch (elementType.type) {
      case 'light':
      case 'switch':
      case 'camera':
      case 'speaker':
      case 'sensor':
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
            Kliknij i przeciągnij aby narysować ścianę
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
            <span className="text-sm text-gray-600">Powiększenie:</span>
            <span className="text-sm font-medium">{zoom}%</span>
          </div>
          
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
}

export default RoomCanvas