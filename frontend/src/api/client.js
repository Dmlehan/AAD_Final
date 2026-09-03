import axios from 'axios';

// Centralized API Base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor: Attach JWT Token when available in future auth phases
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Standardize API responses & errors
apiClient.interceptors.response.use(
  (response) => {
    // Return standard backend ApiResponse data payload
    return response.data;
  },
  (error) => {
    const customError = {
      message: error.response?.data?.message || error.message || 'Network error occurred',
      status: error.response?.status || 500,
      validationErrors: error.response?.data?.validationErrors || null,
      raw: error,
    };
    return Promise.reject(customError);
  }
);

// Convenience API endpoints
export const healthApi = {
  checkHealth: () => apiClient.get('/health'),
  ping: () => apiClient.get('/ping'),
};

export default apiClient;
