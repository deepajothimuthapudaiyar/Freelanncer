import api from './api'

export const getAllUsers = () => api.get('/users')
export const getUser = (id) => api.get(`/users/${id}`)
export const updateUser = (id, data) => api.put(`/users/${id}`, data)
export const deleteUser = (id) => api.delete(`/users/${id}`)
export const getMyProfile = () => api.get('/users/me/profile')
export const updateMyProfile = (data) => api.put('/users/me/profile', data)
export const getProfile = (id) => api.get(`/users/${id}/profile`)
