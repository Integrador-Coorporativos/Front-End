import axios, { type InternalAxiosRequestConfig } from 'axios';
import keycloak from '../api/services/keycloak'; // Ajuste o caminho conforme sua pasta
import { envConfig } from '../config/env';

const api = axios.create({
  baseURL: envConfig.baseUrl
});

// Interceptor de Requisição
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    if (keycloak.token) {
      try {
        // Tenta atualizar o token se ele expirar nos próximos 30 segundos
        await keycloak.updateToken(30);
        
        // Adiciona o cabeçalho Authorization
        // O "config.headers" no Axios 1.x é garantido, então usamos a atribuição direta
        config.headers.Authorization = `Bearer ${keycloak.token}`;
        
      } catch (error) {
        console.error('Falha ao atualizar o token do Keycloak', error);
        // Opcional: Redirecionar para o login se o refresh falhar
        // keycloak.login();
      }
    }
    
    return config;
  },
  (error) => {
    // Trata erros de envio antes mesmo da requisição sair
    return Promise.reject(error);
  }
);

export default api;