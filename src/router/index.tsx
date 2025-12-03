import { createBrowserRouter } from "react-router-dom";
import Cadastro from "../pages/SignUp";
import Login from "../pages/Login";

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
]);
