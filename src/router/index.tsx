import { createBrowserRouter, type DataRouter } from "react-router-dom";
import { withFaroRouterInstrumentation } from "@grafana/faro-react";
import Cadastro from "../pages/SignUp";
import Login from "../pages/Login";
import SelecionarTurmas from "../pages/SelectClasses";
import MinhasTurmas from "../pages/MyClasses";
import Classifications from "../pages/Classifications";
import DetailsClass from "../pages/DetailsClass";
import ControlPanel from "../pages/ControlPanel";
import { CursosList } from "@/components/CursosList";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Classifications />,
  },



  {//Atenção: Página de testes que deve ser removida após o termino.
    path: "/cursosList",
    element: <CursosList />,
  },



  {
    path: "/cadastro",
    element: <Cadastro />,
  },
  {
    path: "/login",
    element: < Login />,
  },
  {
    path: "/selecionar-turmas",
    element: < SelecionarTurmas />,
  },
  {
    path: "/minhas-turmas",
    element: < MinhasTurmas />,
  },
  {
    path: "/classificacao/:id",
    element: <DetailsClass />
  },
  {
    path: "/painel_controle",
    element: <ControlPanel />
  }
]);
export const rotas = withFaroRouterInstrumentation(router);
