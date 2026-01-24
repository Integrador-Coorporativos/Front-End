# Estágio 1: Build
FROM node:22-alpine AS build

# Instala o git (necessário em imagens alpine)
RUN apk add --no-cache git

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

# Recebe as variáveis do ambiente como argumentos de build
ARG VITE_API_BASE_URL
ARG VITE_KEYCLOAK_BASE_URL
ARG VITE_KEYCLOAK_REALM
ARG VITE_KEYCLOAK_CLIENT_ID
# Define elas como variáveis de ambiente para o processo de build
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_KEYCLOAK_BASE_URL=$VITE_KEYCLOAK_BASE_URL
ENV VITE_KEYCLOAK_REALM=$VITE_KEYCLOAK_REALM
ENV VITE_KEYCLOAK_CLIENT_ID=$VITE_KEYCLOAK_CLIENT_ID


RUN npm run build

# Estágio 2: Nginx
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; index index.html; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]