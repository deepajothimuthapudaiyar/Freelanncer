import api from './api'

export const submitReview = (data) => api.post('/reviews', data)
export const getReviewsForUser = (userId) => api.get(`/reviews/user/${userId}`)
