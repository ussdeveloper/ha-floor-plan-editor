import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ElementPalette from '../components/ElementPalette'
import Canvas from '../components/Canvas'
import PropertiesPanel from '../components/PropertiesPanel'
import Toolbar from '../components/Toolbar'
import { useEditorStore } from '../store/editorStore'

const Editor = () => {
  const { projectId } = useParams()
  const { 
    currentProject, 
    selectedElement, 
    loadProject,
    createNewProject 
  } = useEditorStore()

  useEffect(() => {
    if (projectId) {
      loadProject(projectId)
    } else {
      createNewProject()
    }
  }, [projectId, loadProject, createNewProject])

  return (
    <div className="h-screen flex flex-col">
      {/* Toolbar */}
      <Toolbar />
      
      {/* Main editor area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Element palette */}
        <div className="w-64 element-palette flex-shrink-0">
          <ElementPalette />
        </div>
        
        {/* Canvas area */}
        <div className="flex-1 flex flex-col">
          <Canvas />
        </div>
        
        {/* Properties panel */}
        <div className="w-80 properties-panel flex-shrink-0">
          <PropertiesPanel element={selectedElement} />
        </div>
      </div>
    </div>
  )
}

export default Editor