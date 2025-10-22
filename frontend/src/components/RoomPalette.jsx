import React, { useState } from 'react'
import { useDrag } from 'react-dnd'
import { 
  Square3Stack3DIcon,
  RectangleStackIcon,
  WindowIcon,
  ArrowRightOnRectangleIcon,
  PencilIcon,
  CursorArrowRaysIcon
} from '@heroicons/react/24/outline'

const roomTools = [
  {
    type: 'wall',
    name: 'Ściana',
    icon: RectangleStackIcon,
    category: 'room',
    defaultProps: {
      width: 100,
      height: 10,
      color: '#374151',
      strokeWidth: 2
    }
  },
  {
    type: 'door',
    name: 'Drzwi',
    icon: ArrowRightOnRectangleIcon,
    category: 'room',
    defaultProps: {
      width: 60,
      height: 10,
      color: '#92400e',
      strokeWidth: 2
    }
  },
  {
    type: 'window',
    name: 'Okno',
    icon: WindowIcon,
    category: 'room',
    defaultProps: {
      width: 80,
      height: 8,
      color: '#1e40af',
      strokeWidth: 2
    }
  },
  {
    type: 'room',
    name: 'Pomieszczenie',
    icon: Square3Stack3DIcon,
    category: 'room',
    defaultProps: {
      width: 150,
      height: 120,
      color: 'transparent',
      stroke: '#6b7280',
      strokeWidth: 1,
      fill: 'rgba(59, 130, 246, 0.1)'
    }
  }
]

const drawingTools = [
  {
    type: 'select',
    name: 'Wybierz',
    icon: CursorArrowRaysIcon,
    category: 'tool'
  },
  {
    type: 'draw',
    name: 'Rysuj ścianę',
    icon: PencilIcon,
    category: 'tool'
  }
]

const RoomPalette = ({ activeDrawingTool, setActiveDrawingTool }) => {
  const [activeCategory, setActiveCategory] = useState('tools')

  return (
    <div className="space-y-4">
      {/* Drawing tools */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-2">Narzędzia</h3>
        <div className="space-y-1">
          {drawingTools.map((tool) => (
            <DrawingToolButton 
              key={tool.type}
              tool={tool}
              isActive={activeDrawingTool === tool.type}
              onClick={() => setActiveDrawingTool(tool.type)}
            />
          ))}
        </div>
      </div>

      {/* Room elements */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-2">Elementy budynku</h3>
        <div className="space-y-1">
          {roomTools.map((tool) => (
            <DraggableRoomElement key={tool.type} elementType={tool} />
          ))}
        </div>
      </div>
    </div>
  )
}

const DrawingToolButton = ({ tool, isActive, onClick }) => {
  const Icon = tool.icon

  return (
    <button
      onClick={onClick}
      className={`w-full p-2 text-left border rounded-lg transition-colors ${
        isActive 
          ? 'border-blue-500 bg-blue-50 text-blue-700' 
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center space-x-2">
        <Icon className="w-5 h-5" />
        <span className="text-sm font-medium">{tool.name}</span>
      </div>
    </button>
  )
}

const DraggableRoomElement = ({ elementType }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'roomElement',
    item: { elementType },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  const Icon = elementType.icon

  return (
    <div
      ref={drag}
      className={`p-2 border border-gray-200 rounded-lg cursor-move hover:shadow-md transition-shadow ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center space-x-2">
        <Icon className="w-5 h-5 text-gray-600" />
        <span className="text-sm font-medium text-gray-900">
          {elementType.name}
        </span>
      </div>
    </div>
  )
}

export default RoomPalette