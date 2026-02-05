import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthUser } from "@/hooks/useAuthUser";
import keycloak from "@/api/config/keycloak";

interface ProtectedRouteProps {
  allowedRoles: Array<'ROLE_ADMIN' | 'ROLE_PROFESSOR' | 'ROLE_ALUNO' |'ROLE_USER'>;
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const user = useAuthUser();
  const location = useLocation();

  if (keycloak.authenticated === undefined) {
    return <div>Carregando permissões...</div>; 
  }

  if (!keycloak.authenticated) {
    keycloak.login();
    return null;
  }

  if (!user) return null;

  const hasPermission = allowedRoles.includes(user.role);

  if (!hasPermission) {
  // Se for Aluno, manda para 'minhas-notas' ou outra página permitida
  if (user.isStudent) {
    return <Navigate to="/classificacoes" replace />;
  }
  // Fallback padrão para outros casos
  return <Navigate to="/" replace />;
}
  return <Outlet />;
};