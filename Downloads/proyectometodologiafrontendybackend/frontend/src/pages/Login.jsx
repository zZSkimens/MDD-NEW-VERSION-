import { useNavigate } from "react-router-dom";
import { useState } from "react";
import LoginRegisterForm from "@components/LoginRegisterForm";
import { loginService } from "@services/auth.service.js";
import "@styles/loginRegister.css";

const Login = () => {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");

  // Función que maneja el envío del formulario de inicio de sesión
  const loginSubmit = async (data) => {
    try {
      const response = await loginService(data);
      if (response.request.status === 200) {
        console.log("Login exitoso", response.data);
        sessionStorage.setItem("token", response.data.accessToken);
        navigate("/home");
      } else {
        setLoginError("Usuario o contraseña incorrectos");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="page-root">
      <div className="login-register-container">
        <LoginRegisterForm
          mode="login"
          onSubmit={loginSubmit}
          loginError={loginError}
        />
      </div>
    </main>
  );
};

export default Login;
