import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/SpringMVC3',
});

export default api; 