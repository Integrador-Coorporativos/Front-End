// src/config/env.ts
export const envConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  keycloak: {
    baseUrl: import.meta.env.VITE_KEYCLOAK_BASE_URL,
    realm: import.meta.env.VITE_KEYCLOAK_REALM,
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
  },
  appScheme: import.meta.env.VITE_APP_SCHEME,
};
