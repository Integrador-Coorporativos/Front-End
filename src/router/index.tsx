import { createBrowserRouter } from "react-router-dom";
import Cadastro from "../pages/SignUp";
import Login from "../pages/Login";
import SelecionarTurmas from "../pages/SelectClasses";
import MinhasTurmas from "../pages/MyClasses";
import Classifications from "../pages/Classifications";
import Classificacoes from "../pages/RankingDetail"
import ControlPanel from "../pages/ControlPanel";
import ClassesDetail from "../pages/ClassesDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Classifications />,
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
    element: <Classificacoes />
  },
  {
    path: "/painel_controle",
    element: <ControlPanel />
  },
  {
    path: "/turma",
    element: <ClassesDetail />
  }
]);
