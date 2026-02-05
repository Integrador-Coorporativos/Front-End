// src/config/env.ts
export const envConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  keycloak: {
    baseUrl: import.meta.env.VITE_KEYCLOAK_BASE_URL,
    realm: import.meta.env.VITE_KEYCLOAK_REALM,
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
  },
  appScheme: import.meta.env.VITE_APP_SCHEME,
  minio: {
    minioBaseUrl: import.meta.env.VITE_MINIO_BASE_URL,
    minioImageBucket: import.meta.env.VITE_MINIO_BUCKET_IMAGES
  }
  
};
