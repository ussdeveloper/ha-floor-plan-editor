import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  DocumentArrowDownIcon,
  FolderIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import api from '../services/api'

const Projects = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const data = await api.getFloorplans()
      setProjects(data.map(name => ({ name, id: name })))
    } catch (error) {
      console.error('Error loading projects:', error)
      toast.error('Błąd podczas ładowania projektów')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (projectId) => {
    if (!window.confirm('Czy na pewno chcesz usunąć ten projekt?')) {
      return
    }

    try {
      // In real implementation, add delete API endpoint
      toast.success('Projekt został usunięty')
      loadProjects()
    } catch (error) {
      console.error('Error deleting project:', error)
      toast.error('Błąd podczas usuwania projektu')
    }
  }

  const handleExport = async (projectId) => {
    try {
      const blob = await api.exportFloorplan(projectId)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${projectId}-floorplan.yaml`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast.success('Konfiguracja została wyeksportowana')
    } catch (error) {
      console.error('Error exporting project:', error)
      toast.error('Błąd podczas eksportowania projektu')
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Moje projekty</h1>
          <Link to="/editor" className="btn-primary flex items-center">
            <PlusIcon className="w-5 h-5 mr-2" />
            Nowy projekt
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <FolderIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Brak projektów</h3>
            <p className="mt-1 text-sm text-gray-500">
              Rozpocznij tworzenie swojego pierwszego planu piętra.
            </p>
            <div className="mt-6">
              <Link to="/editor" className="btn-primary flex items-center mx-auto w-fit">
                <PlusIcon className="w-5 h-5 mr-2" />
                Utwórz pierwszy projekt
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="card">
                <div className="card-body">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {project.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Ostatnia modyfikacja: {new Date().toLocaleDateString('pl-PL')}
                  </p>
                  
                  <div className="flex space-x-2">
                    <Link
                      to={`/editor/${project.id}`}
                      className="flex-1 btn-primary text-center flex items-center justify-center"
                    >
                      <PencilIcon className="w-4 h-4 mr-1" />
                      Edytuj
                    </Link>
                    
                    <button
                      onClick={() => handleExport(project.id)}
                      className="btn-secondary flex items-center"
                      title="Eksportuj konfigurację"
                    >
                      <DocumentArrowDownIcon className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="btn-danger flex items-center"
                      title="Usuń projekt"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Projects