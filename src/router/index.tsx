import { createBrowserRouter, type DataRouter } from "react-router-dom";
import { withFaroRouterInstrumentation } from "@grafana/faro-react";
import SelecionarTurmas from "../pages/SelectClasses";
import MinhasTurmas from "../pages/MyClasses";
import Classifications from "../pages/Classifications";
import Classificacoes from "../pages/RankingDetail"
import ControlPanel from "../pages/ControlPanel";
import ClassesDetail from "../pages/ClassesDetail";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Dashboard from "../pages/Dashboard";

export const router = createBrowserRouter([
  {
    element: <ProtectedRoute allowedRoles={['ROLE_PROFESSOR', 'ROLE_ADMIN']} />,
    children: [
      {
        path: "/",
        element: <Dashboard />
      },
      {
        path: "/selecionar-turmas",
        element: <SelecionarTurmas />,
      },
      {
        path: "/minhas-turmas",
        children: [
          { index: true, element: <MinhasTurmas /> },
          { path: ":id", element: <ClassesDetail /> },
        ],
      },
    ],
  },
  {
      path: "/classificacoes",
      children: [
          { index: true, element: <Classifications /> },
          { path: ":id", element: <Classificacoes /> },
        ],
      },
  {
    element: <ProtectedRoute allowedRoles={['ROLE_ADMIN']} />,
    children: [
      {
        path: "/painel_controle",
        element: <ControlPanel />
      },
    ],
  },
]);
export const rotas = withFaroRouterInstrumentation(router);
