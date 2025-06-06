import axios from 'axios';
import router from '../router'
import { getToken } from './auth';

const api = axios.create({
    'baseURL': 'http://localhost:3000/api',
})

api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      router.push('/auth')
    }
    return Promise.reject(error)
  }
)

export default api;