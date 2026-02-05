// Interface para o conteúdo do TokenParsed do Keycloak
export interface CustomTokenParsed {
  sub: string;
  name?: string;
  given_name?: string;
  email?: string;
  preferred_username?: string;
  picture?: string;
  type_user?: string[];
  realm_access?: {
    roles: string[];
  };
}

// Interface para o retorno do nosso Hook
export interface AuthUser {
  id: string;
  name: string;
  firstName: string;
  email: string;
  username: string;
  picture: string;
  role: 'ROLE_ADMIN' | 'ROLE_PROFESSOR' | 'ROLE_ALUNO' | 'ROLE_USER';
  roleLabel: 'Administrador' | 'Professor' | 'Aluno' | 'Usuário';
  isAdmin: boolean;
  isProfessor: boolean;
  isStudent: boolean;
}