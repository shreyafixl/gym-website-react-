import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('🌐 API Base URL:', api.defaults.baseURL);

// Request interceptor to add JWT token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('gym-auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔐 Token added to request:', config.url);
    }
    console.log('📤 API Request:', { method: config.method, url: config.url });
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    console.log('📥 API Response:', { status: response.status, url: response.config.url });
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.response?.data?.message,
    });
    
    if (error.response?.status === 401) {
      // Token expired or invalid
      console.log('⚠️  Token expired, clearing auth data');
      localStorage.removeItem('gym-auth-token');
      localStorage.removeItem('gym-auth-user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
