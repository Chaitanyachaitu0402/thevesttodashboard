// src/utils/axiosInstance.js

import axios from 'axios';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001',
});

axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Token has expired or is invalid
      localStorage.removeItem('accessToken');
      history.push('/login');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
