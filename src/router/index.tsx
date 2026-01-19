import { createBrowserRouter } from "react-router-dom";
import Cadastro from "../pages/SignUp";
import Login from "../pages/Login";
import SelecionarTurmas from "../pages/SelectClasses";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <h1>Home</h1>,
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
]);
