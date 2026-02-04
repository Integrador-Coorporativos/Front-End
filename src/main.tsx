import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, matchRoutes } from "react-router-dom";
import { initializeFaro, getWebInstrumentations } from "@grafana/faro-web-sdk";
import { TracingInstrumentation } from "@grafana/faro-web-tracing";
import { ReactIntegration, createReactRouterV6DataOptions } from "@grafana/faro-react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { router } from "./router";
import keycloak from "./api/config/keycloak"; 
import "./index.css";

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
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10, // 10 minutos
      gcTime: 1000 * 60 * 30,    // 30 minutos
      refetchOnWindowFocus: false,
    },
  },
});
keycloak.init({ 
  onLoad: 'login-required', 
  checkLoginIframe: false 
}).then((authenticated) => {
  
  if (authenticated) {
    faro.api.setUser({
      id: keycloak.tokenParsed?.sub,
      username: keycloak.tokenParsed?.preferred_username,
    });
    createRoot(document.getElementById("root")!).render(
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </StrictMode>
    );
  }
}).catch((error) => {
  faro.api.pushError(error);
  console.error("Erro ao inicializar Keycloak:", error);
});