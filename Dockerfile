# Estágio 1: Build
FROM node:22-alpine AS build

RUN apk add --no-cache git
WORKDIR /app

# Otimização de cache para camadas do Docker
COPY package*.json ./
RUN npm install

COPY . .

# Variáveis para o Build do Vite
ARG VITE_API_BASE_URL
ARG VITE_KEYCLOAK_BASE_URL
ARG VITE_KEYCLOAK_REALM
ARG VITE_KEYCLOAK_CLIENT_ID
ARG VITE_MINIO_BASE_URL
ARG VITE_MINIO_BUCKET_IMAGES

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_KEYCLOAK_BASE_URL=$VITE_KEYCLOAK_BASE_URL \
    VITE_KEYCLOAK_REALM=$VITE_KEYCLOAK_REALM \
    VITE_KEYCLOAK_CLIENT_ID=$VITE_KEYCLOAK_CLIENT_ID \
    VITE_MINIO_BUCKET_IMAGES=$VITE_MINIO_BUCKET_IMAGES \
    VITE_MINIO_BASE_URL=$VITE_MINIO_BASE_URL

RUN npm run build

# Estágio 2: Nginx (Proxy Reverso)
FROM nginx:stable-alpine

# 1. Remove a configuração padrão
RUN rm /etc/nginx/conf.d/default.conf

# 2. Copia a sua configuração customizada com os proxies para os serviços
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 3. Copia o build estático do React
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]