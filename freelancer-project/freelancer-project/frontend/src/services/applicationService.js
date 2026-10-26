import api from './api'

export const applyToProject = (data) => api.post('/applications', data)
export const getApplicationsForProject = (projectId) => api.get(`/applications/project/${projectId}`)
export const getApplicationsForFreelancer = (freelancerId) => api.get(`/applications/freelancer/${freelancerId}`)
export const acceptApplication = (id) => api.put(`/applications/${id}/accept`)
export const rejectApplication = (id) => api.put(`/applications/${id}/reject`)
