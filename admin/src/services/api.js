import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginAdmin = (credentials) => api.post('/admin/login', credentials);
export const registerAdmin=(credentials)=>api.post('/admin/register',credentials);
export const getFaqs = (lang = 'en') => api.get(`/faqs?lang=${lang}`);
export const createFaq = (data) => api.post('/faqs', data);
export const updateFaq = (id, data) => api.put(`/faqs/${id}`, data);
export const deleteFaq = (id) => api.delete(`/faqs/${id}`);