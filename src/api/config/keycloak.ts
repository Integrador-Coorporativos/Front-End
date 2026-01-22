import Keycloak from 'keycloak-js';
import { envConfig } from './env';

const keycloakConfig = {
  url: envConfig.keycloak.baseUrl, // URL do seu container Keycloak
  realm: envConfig.keycloak.realm,      // Nome do Realm que você criou
  clientId: envConfig.keycloak.clientId       // ID do Client (deve ser 'Public')
};

// Criar a instância tipada
const keycloak: Keycloak = new Keycloak(keycloakConfig);

export default keycloak;