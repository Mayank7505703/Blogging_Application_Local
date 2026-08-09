import client from './client'

export const getPosts = (pageNumber = 0, pageSize = 9) =>
  client.get('/api/posts', { params: { pageNumber, pageSize } }).then(r => r.data)

export const searchPosts = (query, pageNumber = 0, pageSize = 9) =>
  client.get('/api/posts/search', { params: { query, pageNumber, pageSize } }).then(r => r.data)

export const getPostById = (postId) =>
  client.get(`/api/post/${postId}`).then(r => r.data)

export const getPostsByUser = (userId) =>
  client.get(`/api/user/${userId}/posts`).then(r => r.data)

export const getPostsByCategory = (categoryId) =>
  client.get(`/api/category/${categoryId}/posts`).then(r => r.data)

export const createPost = (postDto, userId, categoryId) =>
  client.post(`/api/user/${userId}/category/${categoryId}`, postDto).then(r => r.data)

export const updatePost = (postId, postDto) =>
  client.put(`/api/post/update/${postId}`, postDto).then(r => r.data)

export const deletePost = (postId) =>
  client.delete(`/api/post/delete/${postId}`).then(r => r.data)

export const uploadPostImage = (postId, file) => {
  const form = new FormData()
  form.append('image', file)
  return client.post(`/api/post/image/upload/${postId}`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data)
}

export const getComments = (postId) =>
  client.get(`/api/post/${postId}/comments`).then(r => r.data)

export const addComment = (postId, content) =>
  client.post(`/api/post/${postId}/comment`, { content }).then(r => r.data)

export const deleteComment = (commentId) =>
  client.delete(`/api/comment/${commentId}`).then(r => r.data)
