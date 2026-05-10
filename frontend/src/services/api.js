import axios from 'axios';

// Get base URL from environment or use default
const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

console.log('🌐 [API] Initializing Axios with base URL:', baseURL);
console.log('🌐 [API] Environment REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
console.log('🌐 [API] Node ENV:', process.env.NODE_ENV);

// Create axios instance with base URL
const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
  withCredentials: true, // Enable credentials (cookies, authorization headers)
});

console.log('🌐 [API] Axios instance created successfully');
console.log('🌐 [API] Base URL:', api.defaults.baseURL);
console.log('🌐 [API] Credentials enabled:', api.defaults.withCredentials);

// Request interceptor to add JWT token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('gym-auth-token');
    const fullURL = `${api.defaults.baseURL}${config.url}`;
    
    console.log('📤 [API Request]', {
      method: config.method.toUpperCase(),
      url: config.url,
      fullURL: fullURL,
      hasToken: !!token,
      tokenLength: token?.length,
      storageKey: 'gym-auth-token',
      timeout: config.timeout,
      withCredentials: config.withCredentials,
      origin: window.location.origin,
    });
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔐 [API] Authorization header added:', {
        url: config.url,
        headerSet: !!config.headers.Authorization,
        tokenPrefix: token.substring(0, 20) + '...',
      });
    } else {
      console.log('⚠️  [API] No token found in localStorage for:', config.url);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ [API] Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration and errors
api.interceptors.response.use(
  (response) => {
    console.log('📥 [API Response]', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      method: response.config.method.toUpperCase(),
      dataKeys: response.data ? Object.keys(response.data) : [],
      dataSize: JSON.stringify(response.data).length,
    });
    return response;
  },
  (error) => {
    // Detailed error logging
    const errorDetails = {
      hasResponse: !!error.response,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      message: error.message,
      code: error.code,
      isNetworkError: !error.response && error.message === 'Network Error',
      isTimeoutError: error.code === 'ECONNABORTED',
      isCORSError: error.message?.includes('CORS') || error.message?.includes('Access-Control'),
      responseMessage: error.response?.data?.message,
      responseData: error.response?.data,
      origin: window.location.origin,
    };

    console.error('❌ [API Error]', errorDetails);

    // CORS error
    if (errorDetails.isCORSError || !error.response) {
      console.error('❌ [API] CORS/Network Error:', {
        message: error.message,
        code: error.code,
        baseURL: api.defaults.baseURL,
        requestURL: error.config?.url,
        fullURL: `${api.defaults.baseURL}${error.config?.url}`,
        origin: window.location.origin,
        withCredentials: error.config?.withCredentials,
      });
    }

    // Network error (no response from server)
    if (!error.response) {
      console.error('❌ [API] Network Error - Server not reachable:', {
        message: error.message,
        code: error.code,
        baseURL: api.defaults.baseURL,
        requestURL: error.config?.url,
        fullURL: `${api.defaults.baseURL}${error.config?.url}`,
      });
    }

    // 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401) {
      console.log('⚠️  [API] 401 Unauthorized - Token expired or invalid, clearing auth data');
      localStorage.removeItem('gym-auth-token');
      localStorage.removeItem('gym-auth-refresh-token');
      localStorage.removeItem('gym-auth-user');
      console.log('🔄 [API] Redirecting to login...');
      window.location.href = '/login';
    }

    // 404 Not Found
    if (error.response?.status === 404) {
      console.warn('⚠️  [API] 404 Not Found:', {
        url: error.config?.url,
        fullURL: `${api.defaults.baseURL}${error.config?.url}`,
      });
    }

    // 500 Server Error
    if (error.response?.status >= 500) {
      console.error('❌ [API] Server Error:', {
        status: error.response.status,
        message: error.response.data?.message,
      });
    }

    return Promise.reject(error);
  }
);

export default api;
