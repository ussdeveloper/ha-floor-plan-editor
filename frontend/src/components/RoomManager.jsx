import React, { useState } from 'react'
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  HomeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

const RoomManager = ({ rooms, onAddRoom, onEditRoom, onDeleteRoom }) => {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingRoom, setEditingRoom] = useState(null)
  const [roomName, setRoomName] = useState('')
  const [roomType, setRoomType] = useState('living_room')

  const roomTypes = [
    { value: 'living_room', label: 'Salon', color: '#fbbf24' },
    { value: 'kitchen', label: 'Kuchnia', color: '#10b981' },
    { value: 'bedroom', label: 'Sypialnia', color: '#8b5cf6' },
    { value: 'bathroom', label: 'Łazienka', color: '#06b6d4' },
    { value: 'hallway', label: 'Korytarz', color: '#6b7280' },
    { value: 'office', label: 'Biuro', color: '#f59e0b' },
    { value: 'dining_room', label: 'Jadalnia', color: '#ef4444' },
    { value: 'garage', label: 'Garaż', color: '#374151' },
    { value: 'basement', label: 'Piwnica', color: '#1f2937' },
    { value: 'attic', label: 'Poddasze', color: '#92400e' },
    { value: 'other', label: 'Inne', color: '#6366f1' }
  ]

  const handleSaveRoom = () => {
    if (!roomName.trim()) return

    const roomData = {
      id: editingRoom?.id || Date.now().toString(),
      name: roomName.trim(),
      type: roomType,
      color: roomTypes.find(t => t.value === roomType)?.color || '#6b7280',
      created: editingRoom?.created || new Date().toISOString(),
      modified: new Date().toISOString()
    }

    if (editingRoom) {
      onEditRoom(roomData)
    } else {
      onAddRoom(roomData)
    }

    setShowAddDialog(false)
    setEditingRoom(null)
    setRoomName('')
    setRoomType('living_room')
  }

  const handleEditClick = (room) => {
    setEditingRoom(room)
    setRoomName(room.name)
    setRoomType(room.type)
    setShowAddDialog(true)
  }

  const handleCancelEdit = () => {
    setShowAddDialog(false)
    setEditingRoom(null)
    setRoomName('')
    setRoomType('living_room')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">Pomieszczenia</h3>
        <button
          onClick={() => setShowAddDialog(true)}
          className="p-1 text-blue-600 hover:text-blue-800"
          title="Dodaj pomieszczenie"
        >
          <PlusIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Rooms list */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {rooms.length === 0 ? (
          <div className="text-xs text-gray-500 text-center py-4">
            Brak zdefiniowanych pomieszczeń
          </div>
        ) : (
          rooms.map((room) => (
            <div key={room.id} className="flex items-center justify-between p-2 border border-gray-200 rounded">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: room.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {room.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {roomTypes.find(t => t.value === room.type)?.label}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleEditClick(room)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                  title="Edytuj"
                >
                  <PencilIcon className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onDeleteRoom(room.id)}
                  className="p-1 text-red-400 hover:text-red-600"
                  title="Usuń"
                >
                  <TrashIcon className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Room Dialog */}
      {showAddDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingRoom ? 'Edytuj pomieszczenie' : 'Dodaj pomieszczenie'}
              </h3>
              <button
                onClick={handleCancelEdit}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="form-label">Nazwa pomieszczenia</label>
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="form-input"
                  placeholder="np. Salon, Kuchnia..."
                  autoFocus
                />
              </div>

              <div>
                <label className="form-label">Typ pomieszczenia</label>
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="form-input"
                >
                  {roomTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Kolor:</span>
                <div 
                  className="w-6 h-6 rounded border-2 border-gray-300"
                  style={{ backgroundColor: roomTypes.find(t => t.value === roomType)?.color }}
                />
              </div>
            </div>
            
            <div className="flex space-x-3 justify-end mt-6">
              <button
                onClick={handleCancelEdit}
                className="btn-secondary"
              >
                Anuluj
              </button>
              <button
                onClick={handleSaveRoom}
                disabled={!roomName.trim()}
                className="btn-primary disabled:opacity-50"
              >
                {editingRoom ? 'Zapisz' : 'Dodaj'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RoomManager