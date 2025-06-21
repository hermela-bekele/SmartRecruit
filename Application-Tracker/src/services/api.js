import axios from 'axios';
import authService from './auth.service';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

console.log('API Service initialized with URL:', API_URL);

// Create axios instance with auth header interceptor
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('API Request:', {
    method: config.method,
    url: config.url,
    baseURL: config.baseURL,
    fullURL: `${config.baseURL}${config.url}`,
    hasToken: !!token,
    tokenLength: token ? token.length : 0,
    tokenStart: token ? token.substring(0, 20) + '...' : 'none'
  });
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  console.error('API Request Error:', error);
  return Promise.reject(error);
});

// Add response interceptor for error handling
api.interceptors.response.use((response) => {
  console.log('API Response:', {
    status: response.status,
    url: response.config.url,
    data: response.data
  });
  return response;
}, (error) => {
  console.error('API Response Error:', {
    status: error.response?.status,
    url: error.config?.url,
    data: error.response?.data,
    message: error.message
  });
  
  // Handle 401 Unauthorized errors
  if (error.response?.status === 401) {
    console.log('Token is invalid or expired. Clearing auth data and redirecting to login.');
    // Clear invalid token and user data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Only redirect if we're not already on the login page
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }
  return Promise.reject(error);
});

export default api; 