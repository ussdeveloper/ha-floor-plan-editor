import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  DocumentArrowDownIcon,
  FolderOpenIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  MagnifyingGlassMinusIcon,
  MagnifyingGlassPlusIcon,
  Square3Stack3DIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowUpOnSquareIcon,
  ArrowDownOnSquareIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { useEditorStore } from '../store/editorStore'
import api from '../services/api'

const Toolbar = () => {
  const navigate = useNavigate()
  const { 
    currentProject, 
    selectedElement,
    zoom, 
    setZoom, 
    saveProject, 
    isDirty,
    snapToGrid,
    setSnapToGrid,
    bringToFront,
    sendToBack,
    bringForward,
    sendBackward
  } = useEditorStore()
  
  const [saving, setSaving] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [projectName, setProjectName] = useState('')

  const handleSave = async () => {
    if (!currentProject?.name && !projectName) {
      setShowSaveDialog(true)
      return
    }

    setSaving(true)
    try {
      await saveProject(projectName || currentProject?.name)
      toast.success('Projekt został zapisany')
      setShowSaveDialog(false)
    } catch (error) {
      console.error('Error saving project:', error)
      toast.error('Błąd podczas zapisywania projektu')
    } finally {
      setSaving(false)
    }
  }

  const handleZoomIn = () => {
    if (zoom < 400) {
      setZoom(Math.min(400, zoom + 25))
    }
  }

  const handleZoomOut = () => {
    if (zoom > 25) {
      setZoom(Math.max(25, zoom - 25))
    }
  }

  const handleZoomReset = () => {
    setZoom(100)
  }

  const handleExport = async (format) => {
    if (!currentProject?.name) {
      toast.error('Najpierw zapisz projekt')
      return
    }

    try {
      const blob = await api.exportFloorplan(currentProject.name, format)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${currentProject.name}-${format}.yaml`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success(`Eksport do ${format} zakończony`)
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Błąd podczas eksportu')
    }
  }

  return (
    <>
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Project info */}
            <div className="flex items-center space-x-2">
              <Square3Stack3DIcon className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-900">
                {currentProject?.name || 'Nowy projekt'}
                {isDirty && <span className="text-orange-500 ml-1">*</span>}
              </span>
            </div>

            {/* File operations */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigate('/')}
                className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                title="Otwórz projekt"
              >
                <FolderOpenIcon className="w-4 h-4 mr-1" />
                Otwórz
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-md disabled:opacity-50"
              >
                <DocumentArrowDownIcon className="w-4 h-4 mr-1" />
                {saving ? 'Zapisywanie...' : 'Zapisz'}
              </button>

              <div className="relative group">
                <button
                  className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                  title="Eksportuj"
                >
                  <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
                  Eksportuj
                </button>
                <div className="hidden group-hover:block absolute left-0 top-full mt-1 bg-white shadow-lg rounded-md border border-gray-200 z-50 min-w-[200px]">
                  <button
                    onClick={() => handleExport('lovelace')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Lovelace Picture-Elements
                  </button>
                  <button
                    onClick={() => handleExport('ha-floorplan')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    HA Floorplan Card
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Z-order controls */}
            {selectedElement && (
              <div className="flex items-center space-x-1 border-r border-gray-200 pr-4">
                <button
                  onClick={() => bringToFront(selectedElement.elementId)}
                  className="p-1.5 text-gray-600 hover:text-gray-900 rounded"
                  title="Na wierzch"
                >
                  <ArrowUpOnSquareIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => bringForward(selectedElement.elementId)}
                  className="p-1.5 text-gray-600 hover:text-gray-900 rounded"
                  title="Do przodu"
                >
                  <ArrowUpIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => sendBackward(selectedElement.elementId)}
                  className="p-1.5 text-gray-600 hover:text-gray-900 rounded"
                  title="Do tyłu"
                >
                  <ArrowDownIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => sendToBack(selectedElement.elementId)}
                  className="p-1.5 text-gray-600 hover:text-gray-900 rounded"
                  title="Na spód"
                >
                  <ArrowDownOnSquareIcon className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Snap to grid */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="snap-to-grid"
                checked={snapToGrid}
                onChange={(e) => setSnapToGrid(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="snap-to-grid" className="text-sm text-gray-600">
                Przyciągaj do siatki
              </label>
            </div>

            {/* Undo/Redo */}
            <div className="flex items-center space-x-1">
              <button
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded"
                title="Cofnij"
                disabled
              >
                <ArrowUturnLeftIcon className="w-4 h-4" />
              </button>
              <button
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded"
                title="Ponów"
                disabled
              >
                <ArrowUturnRightIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Zoom controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleZoomOut}
                className="p-1.5 text-gray-600 hover:text-gray-900 rounded"
                title="Pomniejsz"
                disabled={zoom <= 25}
              >
                <MagnifyingGlassMinusIcon className="w-4 h-4" />
              </button>
              
              <button
                onClick={handleZoomReset}
                className="px-2 py-1 text-sm text-gray-600 hover:text-gray-900 min-w-[60px] text-center"
                title="Resetuj powiększenie"
              >
                {zoom}%
              </button>
              
              <button
                onClick={handleZoomIn}
                className="p-1.5 text-gray-600 hover:text-gray-900 rounded"
                title="Powiększ"
                disabled={zoom >= 400}
              >
                <MagnifyingGlassPlusIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Zapisz projekt
            </h3>
            
            <div className="mb-4">
              <label className="form-label">Nazwa projektu</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="form-input"
                placeholder="Wprowadź nazwę projektu"
                autoFocus
              />
            </div>
            
            <div className="flex space-x-3 justify-end">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="btn-secondary"
              >
                Anuluj
              </button>
              <button
                onClick={handleSave}
                disabled={!projectName.trim() || saving}
                className="btn-primary"
              >
                {saving ? 'Zapisywanie...' : 'Zapisz'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Toolbar