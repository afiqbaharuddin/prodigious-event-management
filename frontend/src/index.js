import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import App from './App';

// Configure axios defaults
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.withCredentials = true;

// Add response interceptor to handle CORS errors
axios.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Add request interceptor to include token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle authentication errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);