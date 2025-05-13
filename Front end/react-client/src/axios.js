import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/apartment-management-backend/api',
});

export default api; 