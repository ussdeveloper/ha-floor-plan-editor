import React, { useState } from 'react'
import { useDrag } from 'react-dnd'
import { 
  LightBulbIcon,
  PowerIcon,
  CameraIcon,
  SpeakerWaveIcon,
  ThermometerIcon
} from '@heroicons/react/24/outline'
import RoomPalette from './RoomPalette'

const elementTypes = [
  {
    type: 'light',
    name: 'Światło',
    icon: LightBulbIcon,
    defaultProps: {
      width: 40,
      height: 40,
      color: '#fbbf24',
      states: {
        on: { color: '#fbbf24', opacity: 1 },
        off: { color: '#6b7280', opacity: 0.5 }
      }
    }
  },
  {
    type: 'switch',
    name: 'Przełącznik',
    icon: PowerIcon,
    defaultProps: {
      width: 30,
      height: 30,
      color: '#10b981',
      states: {
        on: { color: '#10b981', opacity: 1 },
        off: { color: '#6b7280', opacity: 0.5 }
      }
    }
  },
  {
    type: 'camera',
    name: 'Kamera',
    icon: CameraIcon,
    defaultProps: {
      width: 35,
      height: 35,
      color: '#3b82f6',
      states: {
        recording: { color: '#ef4444', opacity: 1 },
        idle: { color: '#3b82f6', opacity: 0.7 }
      }
    }
  },
  {
    type: 'speaker',
    name: 'Głośnik',
    icon: SpeakerWaveIcon,
    defaultProps: {
      width: 35,
      height: 35,
      color: '#8b5cf6',
      states: {
        playing: { color: '#8b5cf6', opacity: 1 },
        paused: { color: '#6b7280', opacity: 0.5 }
      }
    }
  },
  {
    type: 'sensor',
    name: 'Czujnik',
    icon: ThermometerIcon,
    defaultProps: {
      width: 25,
      height: 25,
      color: '#f59e0b',
      states: {
        normal: { color: '#10b981', opacity: 1 },
        alert: { color: '#ef4444', opacity: 1 }
      }
    }
  }
]

const ElementPalette = ({ activeDrawingTool, setActiveDrawingTool }) => {
  const [activeCategory, setActiveCategory] = useState('room')

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Elementy</h2>
        
        {/* Category tabs */}
        <div className="mt-3 flex space-x-1">
          <button
            onClick={() => setActiveCategory('room')}
            className={`px-3 py-1 text-sm rounded-md ${
              activeCategory === 'room'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Plan
          </button>
          <button
            onClick={() => setActiveCategory('devices')}
            className={`px-3 py-1 text-sm rounded-md ${
              activeCategory === 'devices'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Urządzenia
          </button>
          <button
            onClick={() => setActiveCategory('shapes')}
            className={`px-3 py-1 text-sm rounded-md ${
              activeCategory === 'shapes'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Kształty
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {activeCategory === 'room' && (
          <RoomPalette 
            activeDrawingTool={activeDrawingTool}
            setActiveDrawingTool={setActiveDrawingTool}
          />
        )}
        
        {activeCategory === 'devices' && (
          <div className="space-y-2">
            {elementTypes.map((elementType) => (
              <DraggableElement key={elementType.type} elementType={elementType} />
            ))}
          </div>
        )}
        
        {activeCategory === 'shapes' && (
          <div className="space-y-2">
            <div className="text-sm text-gray-500 text-center py-8">
              Kształty będą dostępne w następnej wersji
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const DraggableElement = ({ elementType }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'element',
    item: { elementType },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  const Icon = elementType.icon

  return (
    <div
      ref={drag}
      className={`p-3 border border-gray-200 rounded-lg cursor-move hover:shadow-md transition-shadow ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center space-x-3">
        <Icon className="w-6 h-6 text-gray-600" />
        <span className="text-sm font-medium text-gray-900">
          {elementType.name}
        </span>
      </div>
    </div>
  )
}

export default ElementPalette