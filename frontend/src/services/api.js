import axios from 'axios'

const API_BASE = '/api'

const api = {
  // Health check
  health: () => axios.get(`${API_BASE}/health`),

  // Entities
  getEntities: () => axios.get(`${API_BASE}/entities`).then(res => res.data),

  // Floorplans
  getFloorplans: () => axios.get(`${API_BASE}/floorplans`).then(res => res.data),
  
  getFloorplan: (name) => axios.get(`${API_BASE}/floorplan/${name}`).then(res => res.data),
  
  saveFloorplan: (name, config) => 
    axios.post(`${API_BASE}/floorplan/save`, { name, config }).then(res => res.data),
  
  exportFloorplan: (name) => 
    axios.get(`${API_BASE}/floorplan/${name}/export`, { responseType: 'blob' }).then(res => res.data),
}

export default api