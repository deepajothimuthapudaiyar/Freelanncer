import api from './api'

export const createProject = (data) => api.post('/projects', data)
export const getAllProjects = (search = '', status = '') =>
  api.get('/projects', { params: { search, status } })
export const getProject = (id) => api.get(`/projects/${id}`)
export const updateProject = (id, data) => api.put(`/projects/${id}`, data)
export const deleteProject = (id) => api.delete(`/projects/${id}`)
export const getMyProjects = () => api.get('/projects/my')
export const completeProject = (id) => api.put(`/projects/${id}/complete`)
export const cancelProject = (id) => api.put(`/projects/${id}/cancel`)
export const getClientDashboard = () => api.get('/projects/dashboard/client')
