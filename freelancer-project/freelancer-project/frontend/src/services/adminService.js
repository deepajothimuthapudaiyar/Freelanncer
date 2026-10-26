import api from './api'

export const getDashboard = () => api.get('/admin/dashboard')
export const getAllUsers = () => api.get('/admin/users')
export const getAllProjects = () => api.get('/admin/projects')
export const deleteUser = (id) => api.delete(`/admin/users/${id}`)
export const deleteProject = (id) => api.delete(`/admin/projects/${id}`)
