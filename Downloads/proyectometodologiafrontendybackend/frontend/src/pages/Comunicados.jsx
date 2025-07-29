import "@styles/comunicados.css";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const Comunicados = () => {
  const { user } = useAuth();
  const token = sessionStorage.getItem("token");
  const [comunicados, setComunicados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ titulo: "", contenido: "" });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const fetchComunicados = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`${API_URL}/api/comunicados`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComunicados(res.data.data);
      } catch (err) {
        setError(
          "Error al cargar los comunicados:" +
            (err?.response?.data?.message || "")
        );
      } finally {
        setLoading(false);
      }
    };
    fetchComunicados();
  }, [token]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError("");
    try {
      const res = await axios.post(`${API_URL}/api/comunicados`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComunicados([res.data.data, ...comunicados]);
      setShowForm(false);
      setForm({ titulo: "", contenido: "" });
    } catch (err) {
      setFormError(
        err?.response?.data?.message || "Error al crear el comunicado"
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este comunicado?")) return;
    try {
      await axios.delete(`${API_URL}/api/comunicados/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComunicados(comunicados.filter((c) => c.id !== id));
    } catch (err) {
      alert(err?.response?.data?.message || "Error al eliminar el comunicado");
    }
  };

  return (
    <div className="comunicados-section">
      <h2>Comunicados</h2>
      {user?.rol === "administrador" && (
        <button
          onClick={() => setShowForm((v) => !v)}
          className="btn-crear-comunicado"
        >
          {showForm ? "Cancelar" : "Crear comunicado"}
        </button>
      )}
      {showForm && user?.rol === "administrador" && (
        <form className="comunicado-form" onSubmit={handleCreate}>
          <input
            type="text"
            placeholder="Título"
            value={form.titulo}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
            required
            minLength={5}
            maxLength={100}
          />
          <textarea
            placeholder="Contenido"
            value={form.contenido}
            onChange={(e) => setForm({ ...form, contenido: e.target.value })}
            required
            minLength={10}
          />
          {formError && <div className="form-error">{formError}</div>}
          <button type="submit">Publicar</button>
        </form>
      )}
      {loading ? (
        <div className="loading">Cargando comunicados...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : comunicados.length === 0 ? (
        <div className="no-comunicados">No hay comunicados.</div>
      ) : (
        <ul className="comunicados-list">
          {comunicados.map((c) => (
            <li key={c.id} className="comunicado-item">
              <div className="comunicado-header">
                <span className="comunicado-titulo">{c.titulo}</span>
                <span className="comunicado-fecha">
                  {new Date(c.fechaPublicacion).toLocaleString()}
                </span>
                {user?.rol === "administrador" && (
                  <button
                    className="btn-eliminar-comunicado"
                    onClick={() => handleDelete(c.id)}
                  >
                    Eliminar
                  </button>
                )}
              </div>
              <div className="comunicado-contenido">{c.contenido}</div>
              <div className="comunicado-autor">
                <span>
                  Por: {c.autor?.nombre || c.autor?.username || "Admin"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Comunicados;
