// src/services/api.js
import axios from 'axios';

// ✅ Usa la URL base correcta (sin /api si no lo usas)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'; // ← Sin /api al final

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
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

// Manejo de respuestas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado → logout
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Servicios
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const auditService = {
  create: (data) => api.post('/audits', data),
  getAll: () => api.get('/audits'),
  getOne: (id) => api.get(`/audits/${id}`),
};

export const aiService = {
  // ✅ Este endpoint debe estar definido en FastAPI
  chat: (question) => api.post('/ai/search', { query: question }), // Usa búsqueda semántica
  generateReport: (auditId) => api.get(`/ai/report/${auditId}`),
};

export default api;