// src/api/index.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Intercepta todas as requisições e adiciona o access token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepta respostas para tratar token expirado
api.interceptors.response.use(
  (response) => response, // se a resposta for OK, só retorna
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refresh_token');

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_USERS_BASE}/token/refresh`,
          { refresh_token: refreshToken }
        );

        const newAccessToken = response.data.access_token;

        localStorage.setItem('access_token', newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Erro ao renovar token', refreshError);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login'; 
      }
    }

    return Promise.reject(error);
  }
);

export default api;