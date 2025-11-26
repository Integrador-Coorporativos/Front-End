import { createBrowserRouter } from "react-router-dom";
import Cadastro from "../pages/register-page/registerPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <h1>Home</h1>,
  },
  {
    path: "/cadastro",
    element: <Cadastro />,
  },
]);
