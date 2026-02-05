import { useState, useEffect } from 'react';
import keycloak from "@/api/config/keycloak";
import Perfil from '@/assets/perfil.png';
import { envConfig } from '@/api/config/env';
import { type AuthUser, type CustomTokenParsed } from '@/api/types/auth';

export const useAuthUser = (): AuthUser | null => {
  const [userData, setUserData] = useState<AuthUser | null>(null);

  useEffect(() => {
    const handleAuthChange = () => {
      if (keycloak.authenticated && keycloak.tokenParsed) {
        const token = keycloak.tokenParsed as CustomTokenParsed;
        
        // 1. Hierarquia de Roles (Prioridade: ADMIN > PROFESSOR > ALUNO)
        const roles = token.type_user || token.realm_access?.roles || [];
        
        let priorityRole: AuthUser['role'] = 'ROLE_USER';
        let label: AuthUser['roleLabel'] = 'Usuário';

        if (roles.includes('ROLE_ADMIN')) {
          priorityRole = 'ROLE_ADMIN';
          label = 'Administrador';
        } else if (roles.includes('ROLE_PROFESSOR')) {
          priorityRole = 'ROLE_PROFESSOR';
          label = 'Professor';
        } else if (roles.includes('ROLE_ALUNO')) {
          priorityRole = 'ROLE_ALUNO';
          label = 'Aluno';
        }

        // 2. Construção da imagem (MinIO ou Default)
        const profileImg = token.picture 
          ? `${envConfig.minio.minioBaseUrl}/${envConfig.minio.minioImageBucket}/${token.picture}` 
          : Perfil;

        setUserData({
          id: token.sub,
          name: token.name || '',
          firstName: token.given_name || '',
          email: token.email || '',
          username: token.preferred_username || '',
          picture: profileImg,
          role: priorityRole,
          roleLabel: label,
          isAdmin: priorityRole === 'ROLE_ADMIN',
          isProfessor: priorityRole === 'ROLE_PROFESSOR',
          isStudent: priorityRole === 'ROLE_ALUNO'
        });
      } else {
        setUserData(null);
      }
    };

    // Executa na montagem
    handleAuthChange();
  }, [keycloak.authenticated, keycloak.tokenParsed]);

  return userData;
};