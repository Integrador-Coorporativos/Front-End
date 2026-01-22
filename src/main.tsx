import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, matchRoutes } from "react-router-dom";
import { initializeFaro, getWebInstrumentations } from "@grafana/faro-web-sdk";
import { TracingInstrumentation } from "@grafana/faro-web-tracing";
// Importações necessárias do pacote React do Faro
import { ReactIntegration, createReactRouterV6DataOptions } from "@grafana/faro-react";

import { router } from "./router";
import keycloak from "./api/config/keycloak"; 
import "./index.css";

// 1. Inicializa o Faro (Monitoramento)
const faro = initializeFaro({
  url: 'https://faro-collector-prod-sa-east-1.grafana.net/collect/b73a71b43e0b9786b76a3a15286af940',
  app: {
    name: 'IF Performance',
    version: '1.0.0',
    environment: 'production'
  },
  instrumentations: [
    ...getWebInstrumentations(),
    new TracingInstrumentation(),
    new ReactIntegration({
      router: createReactRouterV6DataOptions({
        matchRoutes,
      }),
    }),
  ],
});

// 2. Inicializa o Keycloak (Autenticação)
keycloak.init({ 
  onLoad: 'login-required', 
  checkLoginIframe: false 
}).then((authenticated) => {
  
  if (authenticated) {
    // OPCIONAL: Envia o ID do usuário para o Grafana para facilitar o suporte
    faro.api.setUser({
      id: keycloak.tokenParsed?.sub,
      username: keycloak.tokenParsed?.preferred_username,
    });

    createRoot(document.getElementById("root")!).render(
      <StrictMode>
        <RouterProvider router={router} />
      </StrictMode>
    );
  }
}).catch((error) => {
  // O Faro captura erros automaticamente, mas aqui garantimos o registro da falha no login
  faro.api.pushError(error);
  console.error("Erro ao inicializar Keycloak:", error);
});