import { create } from 'zustand'
import api from '../services/api'

export const useEditorStore = create((set, get) => ({
  // State
  currentProject: null,
  selectedElement: null,
  elements: [],
  canvas: null,
  zoom: 100,
  gridEnabled: true,
  gridSize: 20,
  isDirty: false,

  // Actions
  setCurrentProject: (project) => set({ currentProject: project }),
  
  setSelectedElement: (element) => set({ selectedElement: element }),
  
  setElements: (elements) => set({ elements, isDirty: true }),
  
  addElement: (element) => set((state) => ({
    elements: [...state.elements, { ...element, id: Date.now().toString() }],
    isDirty: true
  })),
  
  updateElement: (id, updates) => set((state) => ({
    elements: state.elements.map(el => el.id === id ? { ...el, ...updates } : el),
    isDirty: true
  })),
  
  deleteElement: (id) => set((state) => ({
    elements: state.elements.filter(el => el.id !== id),
    selectedElement: state.selectedElement?.id === id ? null : state.selectedElement,
    isDirty: true
  })),
  
  setCanvas: (canvas) => set({ canvas }),
  
  setZoom: (zoom) => set({ zoom }),
  
  setGridEnabled: (enabled) => set({ gridEnabled: enabled }),
  
  setGridSize: (size) => set({ gridSize: size }),

  // Project management
  createNewProject: () => set({
    currentProject: {
      id: null,
      name: 'Nowy projekt',
      created: new Date().toISOString(),
      modified: new Date().toISOString()
    },
    elements: [],
    selectedElement: null,
    isDirty: false
  }),

  loadProject: async (projectId) => {
    try {
      const project = await api.getFloorplan(projectId)
      set({
        currentProject: {
          id: projectId,
          name: projectId,
          ...project
        },
        elements: project.elements || [],
        selectedElement: null,
        isDirty: false
      })
    } catch (error) {
      console.error('Error loading project:', error)
      throw error
    }
  },

  saveProject: async (name) => {
    const state = get()
    const config = {
      elements: state.elements,
      canvas: state.canvas,
      created: state.currentProject?.created || new Date().toISOString(),
      modified: new Date().toISOString()
    }

    try {
      await api.saveFloorplan(name || state.currentProject?.name || 'untitled', config)
      set({
        currentProject: {
          ...state.currentProject,
          name: name || state.currentProject?.name || 'untitled',
          modified: config.modified
        },
        isDirty: false
      })
    } catch (error) {
      console.error('Error saving project:', error)
      throw error
    }
  }
}))