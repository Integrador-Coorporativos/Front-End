import { envConfig } from "./env";

// ---------- Função utilitária para normalizar URLs ----------
const normalizeUrl = (base: string, path: string): string => {
  const cleanBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
};

// ---------- Endpoints OIDC ----------
export const discoveryEndpoints = {
  authorizationEndpoint: normalizeUrl(
    envConfig.keycloak.baseUrl,
    `/realms/${envConfig.keycloak.realm}/protocol/openid-connect/auth`
  ),
  tokenEndpoint: normalizeUrl(
    envConfig.baseUrl,
    `/realms/${envConfig.keycloak.realm}/protocol/openid-connect/token`
  ),
  revocationEndpoint: normalizeUrl(
    envConfig.baseUrl,
    `/realms/${envConfig.keycloak.realm}/protocol/openid-connect/revoke`
  ),
  userInfoEndpoint: normalizeUrl(
    envConfig.baseUrl,
    `/realms/${envConfig.keycloak.realm}/protocol/openid-connect/userinfo`
  ),
} as const;

// ---------- Storage Keys ----------
export const storageKeys = {
  user: "@sadt:user",
  tokens: "@sadt:tokens",
} as const;

// ---------- Configuração de autenticação ----------
export const authConfig = {
  scopes: ["openid", "profile", "email"] as string[],
  additionalParameters: {
    audience: "account",
  },
  responseType: "code" as const,
  usePKCE: true,
  tokenExpirationMarginMs: 5 * 60 * 1000,
  navigationDelayMs: 200,
} as const;

// ---------- Validação da configuração ----------
export const validateAuthConfig = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!envConfig.baseUrl) {
    errors.push("VITE_KEYCLOAK_BASE_URL não configurado");
  }
  if (!envConfig.keycloak.realm) {
    errors.push("VITE_KEYCLOAK_REALM não configurado");
  }
  if (!envConfig.keycloak.clientId) {
    errors.push("VITE_KEYCLOAK_CLIENT_ID não configurado");
  }
  if (!envConfig.appScheme) {
    errors.push("VITE_APP_SCHEME não configurado");
  }

  if (envConfig.baseUrl && !envConfig.baseUrl.startsWith("http")) {
    errors.push("VITE_KEYCLOAK_BASE_URL deve começar com http:// ou https://");
  }

  if (errors.length > 0) {
    console.error("❌ Erros na configuração de autenticação:", errors);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
