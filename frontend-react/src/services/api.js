import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api'; // Tu backend FastAPI

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Interceptor para agregar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

export const auditService = {
  create: (data) => api.post('/audits', data),
  getAll: () => api.get('/audits'),
  getOne: (id) => api.get(`/audits/${id}`),
};

export const aiService = {
  chat: (question) => api.post('/ai/chat', { question }),
  generateReport: (auditId) => api.get(`/ai/report/${auditId}`),
};