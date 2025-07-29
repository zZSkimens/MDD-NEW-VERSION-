import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "@services/auth.service.js";
import {
  FaHome,
  FaUsers,
  FaSignOutAlt,
  FaLaptopMedical,
  FaMoneyCheck,
  FaNewspaper,
  FaRegNewspaper,
  FaTree,
  FaWineBottle,
  FaUser,
} from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import "@styles/Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem("usuario")) || "";
  const userRole = user?.rol;

  const logoutSubmit = () => {
    try {
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  return (
    <div className="sidebar">
      <h2>Condominio</h2>
      <nav>
        <ul>
          <li>
            <NavLink to="/home">
              <FaHome className="icon" /> Inicio
            </NavLink>
          </li>
          <li>
            <NavLink to="/mantenimiento">
              <FaLaptopMedical className="icon" /> Mantenimientos
            </NavLink>
          </li>
          <li>
            <NavLink to="/pagos">
              <FaMoneyCheck className="icon" /> Pagos y cuotas
            </NavLink>
          </li>
          <li>
            <NavLink to="/comunicados">
              <FaRegNewspaper className="icon" /> Comunicados
            </NavLink>
          </li>
          <li>
            <NavLink to="/zonas-comunes">
              <FaTree className="icon" /> Zonas Comunes
            </NavLink>
          </li>
          <li>
            <NavLink to="/opiniones">
              <FaUsers className="icon" /> Opiniones
            </NavLink>
          </li>
          {userRole === "administrador" && (
            <li>
              <NavLink to="/users">
                <FaUsers className="icon" /> Usuarios
              </NavLink>
            </li>
          )}
          <li>
            <NavLink to="/profile">
              <CgProfile className="icon" /> Perfil
            </NavLink>
          </li>

          <li />
          <li className="logout">
            <NavLink to="/login" onClick={logoutSubmit}>
              <FaSignOutAlt className="icon" /> Cerrar Sesión
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
