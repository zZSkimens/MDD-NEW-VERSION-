import "@styles/pagos.css";
import { useState, useEffect } from "react";
import axios from "axios";

const Pagos = () => {
  const [historialPagos, setHistorialPagos] = useState([]);
  const [userType, setUserType] = useState(null); // or "user" based on your logic
  const [userId, setUserId] = useState(null);
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [metodoPago, setMetodoPago] = useState("debito"); // Default payment method
  const [pagoId, setPagoId] = useState(null);
  const [mostrarCrearPago, setMostrarCrearPago] = useState(false);

  useEffect(() => {
    fetchHistorialPagos();
  }, []);

  // with axios
  const fetchHistorialPagos = async () => {
    const userData = JSON.parse(sessionStorage.getItem("usuario"));
    setUserType(userData.rol);

    try {
      const userProfile = await axios.get(
        `http://localhost:3000/api/users/profile`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      setUserId(userProfile.data.data.id);

      let response;
      if (userData.rol === "administrador") {
        response = await axios.get("http://localhost:3000/api/pagos/historial");
      } else {
        response = await axios.get(
          `http://localhost:3000/api/pagos/${userProfile.data.data.id}`
        );
      }
      setHistorialPagos(response.data);
      console.log("Historial de pagos:", response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleRealizarPago = async (pagoId) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/pagos/pagar",
        {
          usuarioId: userId,
          pagoId,
          metodoPago: metodoPago, // or any other method you want to use
        }
      );
      console.log("Pago realizado:", response.data);
      setMostrarPopup(false);
      alert("Pago realizado correctamente.");
      fetchHistorialPagos(); // Refresh the payment history
    } catch (error) {
      console.error("Error realizando el pago:", error);
    }
  };

  const handlePopupPago = (pagoId) => {
    setPagoId(pagoId);
    setMostrarPopup(true);
  };

  const handleCrearPago = async (e) => {
    if (e) e.preventDefault();
    const usuarioEmail = document.querySelector(".crear-pago #usuario").value;
    const monto = document.querySelector(".crear-pago #monto").value;
    const fechaLimite = document.querySelector(
      ".crear-pago #fechaLimite"
    ).value;
    let usuarioId = null;

    try {
      const response = await axios.get(
        `http://localhost:3000/api/users/get-id/${usuarioEmail}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      usuarioId = response.data.data.id;
    } catch (error) {
      console.error("Error obteniendo el ID del usuario:", error);
      alert("Usuario no encontrado.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/pagos/crear-pago",
        {
          usuarioId,
          monto,
          fechaLimite,
        }
      );
      setMostrarCrearPago(false);
      alert("Pago creado correctamente.");
      console.log("Pago creado:", response.data);
      fetchHistorialPagos();
    } catch (error) {
      console.error("Error creando el pago:", error);
      alert("Error creando el pago.");
    }
  };

  return (
    <div className="pagos-section">
      <h2>Pagos</h2>
      {userType === "administrador" && (
        <button
          onClick={() => setMostrarCrearPago(true)}
          className="btn-agregar"
        >
          Crear Pago
        </button>
      )}

      {historialPagos.length > 0 ? (
        <>
          <p>Historial de pagos</p>
          <div className="historial-pagos-container">
            <div className="table-header">
              <span>id</span>
              <span>id de usuario</span>
              <span>monto</span>
              <span>fecha limite</span>
              <span>fecha de pago</span>
              <span>estado</span>
            </div>
            {historialPagos.map((pago) => (
              <div key={pago.id} className="item-pago">
                <span>{pago.id}</span>
                <span>{pago.usuarioId}</span>
                <span>${pago.monto}</span>
                <span>{pago.fechaLimite}</span>
                <span>{pago.estado === "pagado" ? pago.fechaPago : ""}</span>
                <span className={`estado ${pago.estado}`}>{pago.estado}</span>
                {pago.estado === "pendiente" && userType === "usuario" && (
                  <button
                    onClick={() => handlePopupPago(pago.id)}
                    className="btn-realizar-pago"
                  >
                    Realizar Pago
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <p>No hay historial de pagos.</p>
        </>
      )}

      {mostrarPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Realizar Pago</h3>
            <select
              name="metodoPago"
              id="metodoPago"
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value)}
            >
              <option value="debito">Débito</option>
              <option value="credito">Crédito</option>
              <option value="efectivo">Efectivo</option>
              <option value="transferencia">Transferencia</option>
            </select>
            <button
              className="btn-pagar-ahora"
              onClick={() => handleRealizarPago(pagoId)}
            >
              Pagar ahora
            </button>
            <button
              className="btn-cancelar"
              onClick={() => setMostrarPopup(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {mostrarCrearPago && (
        <div className="popup-overlay">
          <form className="popup crear-pago" onSubmit={handleCrearPago}>
            <h3>Crear Pago</h3>
            <div className="form-group">
              <label htmlFor="usuario">Correo del destinatario:</label>
              <input type="email" id="usuario" name="Usuario" required />
            </div>
            <div className="form-group">
              <label htmlFor="monto">Monto a cobrar:</label>
              <input type="number" id="monto" name="monto" required />
            </div>
            <div className="form-group">
              <label htmlFor="fechaLimite">Fecha límite de pago:</label>
              <input type="date" id="fechaLimite" name="fechaLimite" required />
            </div>
            <div className="popup-buttons">
              <button type="submit" className="btn-crear-pago">
                Crear
              </button>
              <button
                type="button"
                onClick={() => setMostrarCrearPago(false)}
                className="btn-cancelar"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Pagos;
