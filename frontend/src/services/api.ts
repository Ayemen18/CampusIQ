import axios from 'axios';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('campusiq_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  register: (data: any) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
};

export const studentService = {
  getMyProfile: () => api.get('/student/profile'),
  getAllStudents: () => api.get('/student/all'),
  getStudentById: (id: string) => api.get(`/student/${id}`),
  updateStudent: (id: string, data: any) => api.put(`/student/${id}`, data),
};

export const ragService = {
  ask: (query: string) => api.post('/ai/query', { query }),
  retrieve: (query: string, top_k = 5) => api.post('/ai/retrieve', { query, top_k }),
  getHistory: () => api.get('/ai/history'),
  clearHistory: () => api.delete('/ai/history'),
  getStatus: () => api.get('/ai/status'),
};

export const documentService = {
  getAll: (category?: string, search?: string) => api.get('/documents', { params: { category, search } }),
  upload: (formData: FormData) => api.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id: string) => api.delete(`/documents/${id}`),
};

export const grievanceService = {
  submit: (data: any) => api.post('/grievances/submit', data),
  getMyGrievances: () => api.get('/grievances/my'),
  getAllGrievances: (status?: string, category?: string) => api.get('/grievances/all', { params: { status, category } }),
  updateStatus: (id: string, data: any) => api.put(`/grievances/${id}`, data),
};

export const noticeService = {
  getAll: (category?: string) => api.get('/notices', { params: { category } }),
  create: (data: any) => api.post('/notices', data),
  delete: (id: string) => api.delete(`/notices/${id}`),
};

export const adminService = {
  getAnalytics: () => api.get('/admin/analytics'),
  getUsers: () => api.get('/admin/users'),
  updateUserRole: (id: string, data: any) => api.put(`/admin/users/${id}`, data),
  getExams: () => api.get('/admin/exams'),
};

export default api;
