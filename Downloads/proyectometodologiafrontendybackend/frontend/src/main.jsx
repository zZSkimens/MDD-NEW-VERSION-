import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "@pages/Root";
import Home from "@pages/Home";
import Login from "@pages/Login";
import Register from "@pages/Register";
import Error404 from "@pages/Error404";
import Users from "@pages/Users";
import Profile from "@pages/Profile";
import Mantenimiento from "@pages/Mantenimiento";
import ProtectedRoute from "@components/ProtectedRoute";
import Pagos from "./pages/Pagos";
import Comunicados from "./pages/Comunicados";
import ZonasComunes from "./pages/ZonasComunes";
import Opiniones from "./pages/Opiniones";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error404 />,
    children: [
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/users",
        element: (
          <ProtectedRoute allowedRoles={["administrador"]}>
            <Users />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/mantenimiento",
        element: <Mantenimiento />,
      },
      {
        path: "/pagos",
        element: <Pagos />,
      },
      {
        path: "/comunicados",
        element: <Comunicados />,
      },
      {
        path: "/zonas-comunes",
        element: <ZonasComunes />,
      },
      {
        path: "/opiniones",
        element: <Opiniones />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
