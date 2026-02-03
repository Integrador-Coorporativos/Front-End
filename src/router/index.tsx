import { createBrowserRouter, type DataRouter } from "react-router-dom";
import { withFaroRouterInstrumentation } from "@grafana/faro-react";
import SelecionarTurmas from "../pages/SelectClasses";
import MinhasTurmas from "../pages/MyClasses";
import Classifications from "../pages/Classifications";
import Classificacoes from "../pages/RankingDetail"
import ControlPanel from "../pages/ControlPanel";
import ClassesDetail from "../pages/ClassesDetail";
import Dashboard from "../pages/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Classifications />,
  },
  {
    path: "/selecionar-turmas",
    element: < SelecionarTurmas />,
  },
  {
    path: "/minhas-turmas",
    children: [
      { index: true, element: <MinhasTurmas /> },
      { path: ":id", element: <ClassesDetail /> },
    ],
  },
  {
    path: "/classificacao/:id",
    element: <Classificacoes />
  },
  {
    path: "/painel_controle",
    element: <ControlPanel />
  },
  {
    path: "/dashboard",
    element: <Dashboard />
  }
]);
export const rotas = withFaroRouterInstrumentation(router);
