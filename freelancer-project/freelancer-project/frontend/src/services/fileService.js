import api from './api'

export const uploadFile = (projectId, file) => {
  const formData = new FormData()
  formData.append('projectId', projectId)
  formData.append('file', file)
  return api.post('/files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
export const getFilesForProject = (projectId) => api.get(`/files/project/${projectId}`)
export const deleteFile = (id) => api.delete(`/files/${id}`)
