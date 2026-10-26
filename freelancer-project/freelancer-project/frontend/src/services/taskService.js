import api from './api'

export const createTask = (data) => api.post('/tasks', data)
export const getTasksForProject = (projectId) => api.get(`/tasks/project/${projectId}`)
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data)
export const deleteTask = (id) => api.delete(`/tasks/${id}`)
export const getProgress = (projectId) => api.get(`/tasks/project/${projectId}/progress`)
