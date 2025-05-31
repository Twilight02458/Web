import axios from 'axios';
import cookies from 'react-cookies';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = cookies.load('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Log request details for debugging
    console.log('Request config:', {
      method: config.method,
      url: config.url,
      headers: config.headers,
      data: config.data
    });
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Log error details for debugging
      console.error('Response error:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
      
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        cookies.remove('token');
        window.location.href = '/login';
      }
      // Handle 405 Method Not Allowed
      if (error.response.status === 405) {
        console.error('Method not allowed:', error.response.data);
      }
    }
    return Promise.reject(error);
  }
);

export default api; 