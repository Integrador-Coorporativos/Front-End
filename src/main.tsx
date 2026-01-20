import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import keycloak from "./api/services/keycloak"; // 1. Importe a sua configuração

// 2. Envolva a renderização no init do Keycloak
keycloak.init({ 
  onLoad: 'login-required', 
  checkLoginIframe: false 
}).then((authenticated) => {
  
  if (authenticated) {
    // 3. Só renderiza o RouterProvider se estiver autenticado
    createRoot(document.getElementById("root")!).render(
      <StrictMode>
        <RouterProvider router={router} />
      </StrictMode>
    );
  }

}).catch((error) => {
  console.error("Erro ao inicializar Keycloak:", error);
  // Opcional: Renderizar uma tela de erro amigável aqui
});