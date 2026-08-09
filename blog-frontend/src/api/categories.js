import client from './client'

export const getCategories = () => client.get('/api/category').then(r => r.data)
export const getCategoryById = (id) => client.get(`/api/category/${id}`).then(r => r.data)
export const createCategory = (data) => client.post('/api/category', data).then(r => r.data)
export const updateCategory = (id, data) => client.put(`/api/category/${id}`, data).then(r => r.data)
export const deleteCategory = (id) => client.delete(`/api/category/${id}`).then(r => r.data)
