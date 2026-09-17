import axios from 'axios';

// Central axios instance. Change baseURL here if your backend runs elsewhere.
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Automatically attach the JWT (if the user is logged in) to every request.
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('lss_user');
  if (stored) {
    const { token } = JSON.parse(stored);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
