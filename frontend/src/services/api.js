import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (data) => api.post('/auth/register', data)
};

export const userService = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`)
};

export const programService = {
  getAll: () => api.get('/programs'),
  getById: (id) => api.get(`/programs/${id}`),
  create: (data) => api.post('/programs', data),
  update: (id, data) => api.put(`/programs/${id}`, data),
  delete: (id) => api.delete(`/programs/${id}`)
};

export const taskService = {
  getByProgram: (programId) => api.get(`/tasks/program/${programId}`),
  getById: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
  assign: (data) => api.post('/tasks/assign', data),
  getUserTasks: (userId) => api.get(`/tasks/user/${userId}`),
  updateUserTask: (userId, taskId, data) => api.put(`/tasks/user/${userId}/task/${taskId}`, data)
};

export const documentService = {
  getUserDocuments: (userId) => api.get(`/documents/user/${userId}`),
  upload: (data) => api.post('/documents', data),
  verify: (id) => api.put(`/documents/${id}/verify`)
};

export default api;