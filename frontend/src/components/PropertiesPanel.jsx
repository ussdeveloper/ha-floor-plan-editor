import React, { useState, useEffect } from 'react'
import { ChromePicker } from 'react-color'
import { TrashIcon } from '@heroicons/react/24/outline'
import { useEditorStore } from '../store/editorStore'
import RoomManager from './RoomManager'
import api from '../services/api'

const PropertiesPanel = ({ element }) => {
  const { updateElement, deleteElement } = useEditorStore()
  const [entities, setEntities] = useState([])
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [selectedColor, setSelectedColor] = useState('#000000')
  const [rooms, setRooms] = useState([])

  useEffect(() => {
    loadEntities()
  }, [])

  useEffect(() => {
    if (element && element.fill) {
      setSelectedColor(element.fill)
    }
  }, [element])

  const loadEntities = async () => {
    try {
      const data = await api.getEntities()
      setEntities(data)
    } catch (error) {
      console.error('Error loading entities:', error)
    }
  }

  const handlePropertyChange = (property, value) => {
    if (!element || !element.elementId) return

    // Update fabric object
    element.set(property, value)
    element.canvas?.renderAll()

    // Update store
    updateElement(element.elementId, { [property]: value })
  }

  const handleColorChange = (color) => {
    setSelectedColor(color.hex)
    handlePropertyChange('fill', color.hex)
  }

  const handleDelete = () => {
    if (!element || !element.elementId) return
    
    // Remove from canvas
    element.canvas?.remove(element)
    element.canvas?.renderAll()

    // Remove from store
    deleteElement(element.elementId)
  }

  const handleAddRoom = (roomData) => {
    setRooms([...rooms, roomData])
  }

  const handleEditRoom = (roomData) => {
    setRooms(rooms.map(room => room.id === roomData.id ? roomData : room))
  }

  const handleDeleteRoom = (roomId) => {
    if (window.confirm('Czy na pewno chcesz usunąć to pomieszczenie?')) {
      setRooms(rooms.filter(room => room.id !== roomId))
    }
  }

  const isRoomElement = element?.elementType && ['wall', 'door', 'window', 'room'].includes(element.elementType)

  if (!element) {
    return (
      <div className="h-full p-4">
        <div className="space-y-6">
          {/* Room management when no element is selected */}
          <RoomManager 
            rooms={rooms}
            onAddRoom={handleAddRoom}
            onEditRoom={handleEditRoom}
            onDeleteRoom={handleDeleteRoom}
          />
          
          <div className="text-center py-8">
            <div className="text-gray-400 text-sm">
              Wybierz element aby edytować właściwości
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Właściwości</h2>
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800 p-1"
            title="Usuń element"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-6">
        {/* Basic properties */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Podstawowe</h3>
          
          <div className="space-y-3">
            <div>
              <label className="form-label">Nazwa</label>
              <input
                type="text"
                value={element.name || ''}
                onChange={(e) => handlePropertyChange('name', e.target.value)}
                className="form-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="form-label">X</label>
                <input
                  type="number"
                  value={Math.round(element.left || 0)}
                  onChange={(e) => handlePropertyChange('left', parseFloat(e.target.value))}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Y</label>
                <input
                  type="number"
                  value={Math.round(element.top || 0)}
                  onChange={(e) => handlePropertyChange('top', parseFloat(e.target.value))}
                  className="form-input"
                />
              </div>
            </div>

            {/* Different properties for room elements vs devices */}
            {isRoomElement ? (
              // Room element properties (walls, doors, windows)
              <div className="space-y-3">
                {element.elementType === 'wall' && (
                  <div>
                    <label className="form-label">Grubość ściany</label>
                    <input
                      type="number"
                      min="5"
                      max="30"
                      value={element.strokeWidth || 10}
                      onChange={(e) => handlePropertyChange('strokeWidth', parseFloat(e.target.value))}
                      className="form-input"
                    />
                  </div>
                )}
                
                {element.elementType === 'door' && (
                  <div>
                    <label className="form-label">Szerokość drzwi</label>
                    <input
                      type="number"
                      min="40"
                      max="120"
                      value={Math.round((element.width || 0) * (element.scaleX || 1))}
                      onChange={(e) => {
                        const newWidth = parseFloat(e.target.value)
                        const scaleX = newWidth / (element.width || 1)
                        handlePropertyChange('scaleX', scaleX)
                      }}
                      className="form-input"
                    />
                  </div>
                )}
                
                {element.elementType === 'window' && (
                  <div>
                    <label className="form-label">Szerokość okna</label>
                    <input
                      type="number"
                      min="30"
                      max="200"
                      value={Math.round((element.width || 0) * (element.scaleX || 1))}
                      onChange={(e) => {
                        const newWidth = parseFloat(e.target.value)
                        const scaleX = newWidth / (element.width || 1)
                        handlePropertyChange('scaleX', scaleX)
                      }}
                      className="form-input"
                    />
                  </div>
                )}
                
                {element.elementType === 'room' && (
                  <div>
                    <label className="form-label">Pomieszczenie</label>
                    <select
                      value={element.roomId || ''}
                      onChange={(e) => handlePropertyChange('roomId', e.target.value)}
                      className="form-input"
                    >
                      <option value="">Wybierz pomieszczenie...</option>
                      {rooms.map((room) => (
                        <option key={room.id} value={room.id}>
                          {room.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            ) : (
              // Device element properties
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Szerokość</label>
                  <input
                    type="number"
                    value={Math.round((element.width || 0) * (element.scaleX || 1))}
                    onChange={(e) => {
                      const newWidth = parseFloat(e.target.value)
                      const scaleX = newWidth / (element.width || 1)
                      handlePropertyChange('scaleX', scaleX)
                    }}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Wysokość</label>
                  <input
                    type="number"
                    value={Math.round((element.height || 0) * (element.scaleY || 1))}
                    onChange={(e) => {
                      const newHeight = parseFloat(e.target.value)
                      const scaleY = newHeight / (element.height || 1)
                      handlePropertyChange('scaleY', scaleY)
                    }}
                    className="form-input"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="form-label">Obrót (°)</label>
              <input
                type="number"
                value={Math.round(element.angle || 0)}
                onChange={(e) => handlePropertyChange('angle', parseFloat(e.target.value))}
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Wygląd</h3>
          
          <div className="space-y-3">
            <div>
              <label className="form-label">Kolor</label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="w-8 h-8 rounded border-2 border-gray-300"
                  style={{ backgroundColor: selectedColor }}
                />
                <span className="text-sm text-gray-600">{selectedColor}</span>
              </div>
              
              {showColorPicker && (
                <div className="absolute z-10 mt-2">
                  <div 
                    className="fixed inset-0" 
                    onClick={() => setShowColorPicker(false)}
                  />
                  <ChromePicker
                    color={selectedColor}
                    onChange={handleColorChange}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="form-label">Przezroczystość</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={element.opacity || 1}
                onChange={(e) => handlePropertyChange('opacity', parseFloat(e.target.value))}
                className="w-full"
              />
              <span className="text-xs text-gray-500">
                {Math.round((element.opacity || 1) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Home Assistant integration - only for device elements */}
        {!isRoomElement && (
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Integracja HA</h3>
            
            <div className="space-y-3">
              <div>
                <label className="form-label">Encja</label>
                <select
                  value={element.entityId || ''}
                  onChange={(e) => handlePropertyChange('entityId', e.target.value)}
                  className="form-input"
                >
                  <option value="">Wybierz encję...</option>
                  {entities.map((entity) => (
                    <option key={entity.entity_id} value={entity.entity_id}>
                      {entity.friendly_name} ({entity.entity_id})
                    </option>
                  ))}
                </select>
              </div>

              {element.entityId && (
                <div>
                  <label className="form-label">Akcja po kliknięciu</label>
                  <select
                    value={element.clickAction || 'more-info'}
                    onChange={(e) => handlePropertyChange('clickAction', e.target.value)}
                    className="form-input"
                  >
                    <option value="more-info">Pokaż więcej informacji</option>
                    <option value="toggle">Przełącz stan</option>
                    <option value="navigate">Przejdź do widoku</option>
                    <option value="call-service">Wywołaj usługę</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Room assignment for device elements */}
        {!isRoomElement && (
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Pomieszczenie</h3>
            
            <div>
              <label className="form-label">Przypisz do pomieszczenia</label>
              <select
                value={element.roomId || ''}
                onChange={(e) => handlePropertyChange('roomId', e.target.value)}
                className="form-input"
              >
                <option value="">Brak przypisania</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* States configuration */}
        {element.entityId && (
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Stany</h3>
            
            <div className="space-y-2 text-sm text-gray-600">
              <p>Konfiguracja stanów będzie dostępna w następnej wersji.</p>
              <p>Tutaj będzie można ustawić różne kolory i style dla różnych stanów encji.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PropertiesPanel