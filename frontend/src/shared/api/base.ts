import axios from 'axios';
import { useAuthStore } from '@/entities/user';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1/';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalConfig = err.config;
    if (originalConfig.url !== '/auth/token/' && err.response?.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;
      try {
        const newAccessToken = await useAuthStore.getState().refreshAccessToken();
        if (newAccessToken) {
          originalConfig.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return api(originalConfig);
        }
        return Promise.reject(err);
      } catch (_error) {
        return Promise.reject(_error);
      }
    }
    return Promise.reject(err);
  }
);