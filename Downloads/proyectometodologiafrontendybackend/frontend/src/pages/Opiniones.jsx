import "@styles/opiniones.css";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import opinionService from "../services/opinion.service.js";

const Opiniones = () => {
  const { user } = useAuth();
  const [opiniones, setOpiniones] = useState([]);
  const [nuevaOpinion, setNuevaOpinion] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarOpiniones();
  }, []);

  const cargarOpiniones = async () => {
    setLoading(true);
    try {
      const res = await opinionService.listarOpiniones();
      setOpiniones(res.data);
    } catch (err) {
      // Manejo de error
      console.error("Error al cargar opiniones:", err);
    }
    setLoading(false);
  };

  const handleOpinionSubmit = async (e) => {
    e.preventDefault();
    if (!nuevaOpinion.trim()) return;
    try {
      await opinionService.crearOpinion({ opinion: nuevaOpinion });
      setNuevaOpinion("");
      cargarOpiniones();
    } catch (err) {
      // Manejo de error
      console.error("Error al enviar opinión:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas borrar esta opinión?")) return;
    try {
      await opinionService.eliminarOpinion(id);
      cargarOpiniones();
    } catch (err) {
      // Manejo de error
      console.error("Error al eliminar opinión:", err);
    }
  };

  return (
    <div className="opiniones-container">
      <h2>Foro de Opiniones</h2>
      <form onSubmit={handleOpinionSubmit} className="opinion-form">
        <textarea
          value={nuevaOpinion}
          onChange={(e) => setNuevaOpinion(e.target.value)}
          placeholder="Escribe tu opinión..."
        />
        <button type="submit" disabled={loading}>
          Enviar
        </button>
      </form>
      <div className="opiniones-list">
        {loading ? (
          <p>Cargando...</p>
        ) : opiniones.length === 0 ? (
          <p>No hay opiniones.</p>
        ) : user?.rol === "administrador" ? (
          <table className="admin-table opiniones-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Opinión</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {opiniones.map((op) => (
                <tr key={op.id}>
                  <td>{new Date(op.fecha).toLocaleString()}</td>
                  <td>{op.opinion}</td>
                  <td>
                    <button
                      className="delete-btn danger"
                      onClick={() => handleDelete(op.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          opiniones.map((op) => (
            <div key={op.id} className="opinion-item">
              <div>
                <span>{new Date(op.fecha).toLocaleString()}</span>
              </div>
              <p>{op.opinion}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Opiniones;
