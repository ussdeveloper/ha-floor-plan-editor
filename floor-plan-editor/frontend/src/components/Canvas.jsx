import React, { useRef, useEffect, useState } from 'react'
import { useDrop } from 'react-dnd'
import { fabric } from 'fabric'
import { useEditorStore } from '../store/editorStore'

const Canvas = () => {
  const canvasRef = useRef(null)
  const fabricCanvasRef = useRef(null)
  const { 
    elements, 
    selectedElement,
    addElement, 
    updateElement, 
    setSelectedElement, 
    setCanvas,
    zoom,
    gridEnabled,
    gridSize
  } = useEditorStore()

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'element',
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset()
      if (offset && fabricCanvasRef.current) {
        const canvasRect = fabricCanvasRef.current.getElement().getBoundingClientRect()
        const x = offset.x - canvasRect.left
        const y = offset.y - canvasRect.top
        
        handleAddElement(item.elementType, x, y)
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

      // Draw grid if enabled
      if (gridEnabled) {
        drawGrid(canvas)
      }

      return () => {
        canvas.dispose()
      }
    }
  }, [setCanvas, setSelectedElement, updateElement, gridEnabled, gridSize])

  useEffect(() => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.setZoom(zoom / 100)
      fabricCanvasRef.current.renderAll()
    }
  }, [zoom])

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

  const handleAddElement = (elementType, x, y) => {
    if (!fabricCanvasRef.current) return

    const element = {
      type: elementType.type,
      name: elementType.name,
      left: x,
      top: y,
      ...elementType.defaultProps
    }

    // Create fabric object based on element type
    let fabricObject
    
    switch (elementType.type) {
      case 'sensor': {
        // Render sensor as a small circle with a label underneath
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

    // Add element ID to fabric object
    fabricObject.elementId = Date.now().toString()
    element.id = fabricObject.elementId

    fabricCanvasRef.current.add(fabricObject)
    fabricCanvasRef.current.setActiveObject(fabricObject)
    fabricCanvasRef.current.renderAll()

    addElement(element)
    setSelectedElement(fabricObject)
  }

  return (
    <div className="flex-1 p-4">
      <div className="canvas-container" ref={drop}>
        <canvas
          ref={canvasRef}
          className={`border-2 ${isOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}`}
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
      <div className="mt-4 flex items-center space-x-4">
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
    </div>
  )
}

export default Canvas