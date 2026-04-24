// frontend/src/services/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const registerUser = async (userData) => {
  const response = await api.post('/auth/signup', userData);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// Task APIs
export const getTasks = async (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const response = await api.get(`/tasks${queryParams ? `?${queryParams}` : ''}`);
  return response.data;
};

export const getTaskById = async (taskId) => {
  const response = await api.get(`/tasks/${taskId}`);
  return response.data.task;
};

export const createTask = async (taskData) => {
  const response = await api.post('/tasks', taskData);
  return response.data;
};

export const updateTask = async (taskId, taskData) => {
  const response = await api.put(`/tasks/${taskId}`, taskData);
  return response.data;
};

export const deleteTask = async (taskId) => {
  const response = await api.delete(`/tasks/${taskId}`);
  return response.data;
};

export const updateTaskStatus = async (taskId, status) => {
  const response = await api.put(`/tasks/${taskId}`, { status });
  return response.data;
};

export const getTaskStats = async () => {
  const response = await api.get('/tasks/stats');
  return response.data;
};

// User Settings APIs
export const updateUserProfile = async (data) => {
  const response = await api.put('/auth/profile', data);
  if (response.data.user) {
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const updatePassword = async (data) => {
  const response = await api.put('/auth/password', data);
  return response.data;
};

export const deleteAccount = async () => {
  const response = await api.delete('/auth/account');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  return response.data;
};

export default api;