import { useEffect, useState } from "react";
import { getUserRating } from "@services/rating.service.js";

import { useGetMantenimiento } from "@hooks/mantenimiento/useGetMantenimiento.jsx";
import {
  createMantenimiento,
  updateMantenimientoEstado,
  deleteMantenimiento,
} from "@services/mantenimiento.service.js";
import "@styles/mantenimiento.css";

const Mantenimiento = () => {
  const [mantenimientoData, setMantenimientoData] = useState(null);
  const [descripcion, setDescripcion] = useState("");
  const [estadoEdit, setEstadoEdit] = useState({});
  const { fetchMantenimiento } = useGetMantenimiento();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const getMantenimientoData = async () => {
      const mantenimientoData = await fetchMantenimiento();
      setMantenimientoData(mantenimientoData);

      // Checar ratings existentes para el usuario logueado
      const userData = sessionStorage.getItem("usuario");
      let usuarioId = null;
      if (userData) {
        try {
          const parsed = JSON.parse(userData);
          usuarioId = parsed.id || parsed._id || parsed.usuarioId;
        } catch {
          // Si no se puede parsear el usuario, no hacemos nada
          alert("Error al obtener el usuario.");
        }
      }
      if (usuarioId && Array.isArray(mantenimientoData)) {
        const ratingsObj = {};
        for (const item of mantenimientoData) {
          try {
            const rating = await getUserRating(item.id, usuarioId);
            if (rating) {
              ratingsObj[item.id] = true;
            }
          } catch {
            // Si no se encuentra el rating, no hacemos nada
            ratingsObj[item.id] = false;
          }
        }
        setRatingSent(ratingsObj);
      }
    };
    getMantenimientoData();
    checkAdmin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAdmin = () => {
    const userData = sessionStorage.getItem("usuario");
    if (userData) {
      const role = JSON.parse(userData).rol;
      setIsAdmin(role === "administrador");
    }
  };

  // se crea el mantenimiento mauri qlo
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!descripcion.trim()) return;
    await createMantenimiento(descripcion);
    setDescripcion("");
    // Refrescar lista
    const mantenimientoData = await fetchMantenimiento();
    setMantenimientoData(mantenimientoData);
  };

  // cambia el estado
  const handleEstadoChange = (id, value) => {
    setEstadoEdit((prev) => ({ ...prev, [id]: value }));
  };

  const handleUpdateEstado = async (id) => {
    const estado = estadoEdit[id];
    if (!estado) return;
    await updateMantenimientoEstado(id, estado);
    // rifrish xd
    const mantenimientoData = await fetchMantenimiento();
    setMantenimientoData(mantenimientoData);
  };

  // borrar
  const handleDelete = async (id) => {
    await deleteMantenimiento(id);
    // rifrish
    const mantenimientoData = await fetchMantenimiento();
    setMantenimientoData(mantenimientoData);
  };

  // Estado para ratings y comentarios locales
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});
  const [ratingSent, setRatingSent] = useState({});

  // Maneja el click en una estrella
  const handleStarClick = (mantenimientoId, value) => {
    setRatings((prev) => ({ ...prev, [mantenimientoId]: value }));
  };

  // Maneja el cambio de comentario
  const handleCommentChange = (mantenimientoId, value) => {
    setComments((prev) => ({ ...prev, [mantenimientoId]: value }));
  };

  // Enviar rating
  const submitRating = async (mantenimientoId) => {
    if (ratingSent[mantenimientoId]) return; // Evita doble envío
    const ratingValue = ratings[mantenimientoId];
    const commentValue = comments[mantenimientoId] || "";
    if (!ratingValue) return;
    // Obtener id del usuario directamente del userData
    let usuarioId = null;
    const userData = sessionStorage.getItem("usuario");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        usuarioId = parsed.id || parsed._id || parsed.usuarioId;
      } catch {
        alert("Error al obtener el usuario.");
      }
    }
    if (!usuarioId) {
      alert("No se pudo identificar el id del usuario para calificar.");
      return;
    }
    setRatingSent((prev) => ({ ...prev, [mantenimientoId]: "sending" })); // Estado intermedio
    try {
      // Enviar rating directamente
      const response = await fetch(`http://localhost:3000/api/ratings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mantenimientoId: mantenimientoId,
          rating: ratingValue,
          comments: commentValue,
          usuarioId: usuarioId,
        }),
      });
      if (response.status === 409) {
        setRatingSent((prev) => ({ ...prev, [mantenimientoId]: "already" }));
        return;
      }
      if (!response.ok) {
        throw new Error("Error al enviar la calificación");
      }
      setRatingSent((prev) => ({ ...prev, [mantenimientoId]: true }));
    } catch (error) {
      setRatingSent((prev) => ({ ...prev, [mantenimientoId]: false }));
      console.error("Error al enviar la calificación:", error);
    }
  };

  return (
    <div className="mantenimiento-container">
      <h1>Mantenimientos</h1>
      <form className="mantenimiento-form" onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="Descripción del mantenimiento"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <button type="submit">Crear Mantenimiento</button>
      </form>

      <div className="mantenimiento-list">
        {mantenimientoData &&
        Array.isArray(mantenimientoData) &&
        mantenimientoData.length > 0 ? (
          mantenimientoData.map((item) => (
            <div key={item.id} className="mantenimiento-card">
              <div>
                <b>ID:</b> {item.id}
              </div>
              <div>
                <b>Descripción:</b> {item.descripcion}
              </div>
              <div className="estado">
                <b>Estado:</b> {item.estado}
              </div>
              <div className="fechas">
                <b>Creado en:</b> {item.creadoEn}
              </div>
              <div className="fechas">
                <b>Actualizado en:</b> {item.actualizadoEn}
              </div>

              {isAdmin && (
                <div style={{ marginTop: "0.5rem" }}>
                  <select
                    value={estadoEdit[item.id] || item.estado}
                    onChange={(e) =>
                      handleEstadoChange(item.id, e.target.value)
                    }
                  >
                    <option value="no iniciado">No iniciado</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="en proceso">En proceso</option>
                    <option value="terminado">Terminado</option>
                  </select>
                  <button
                    onClick={() => handleUpdateEstado(item.id)}
                    disabled={
                      estadoEdit[item.id]
                        ? estadoEdit[item.id] === item.estado
                        : true
                    }
                  >
                    Cambiar Estado
                  </button>
                  <button onClick={() => handleDelete(item.id)}>
                    Eliminar
                  </button>
                </div>
              )}
              {item.estado === "terminado" && !isAdmin && (
                <div className="rating-section" id={`rating-form-${item.id}`}>
                  {ratingSent[item.id] === true ? (
                    <p style={{ color: "green", fontWeight: "bold" }}>
                      ¡Gracias por tu calificación!
                    </p>
                  ) : ratingSent[item.id] === "already" ? (
                    <p style={{ color: "#e67e22", fontWeight: "bold" }}>
                      Ya has calificado este mantenimiento.
                    </p>
                  ) : (
                    <>
                      <p>Califica nuestro servicio</p>
                      <div
                        className="rating-stars"
                        style={{
                          fontSize: "2.5rem",
                          color: "#FFD700",
                          cursor: "pointer",
                        }}
                      >
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            onClick={() => handleStarClick(item.id, star)}
                            style={{
                              color:
                                (ratings[item.id] || 0) >= star
                                  ? "#FFD700"
                                  : "#ccc",
                              transition: "color 0.2s",
                              marginRight: 2,
                            }}
                            role="button"
                            aria-label={`Estrella ${star}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <div className="comment-input">
                        <textarea
                          placeholder="Deja un comentario (opcional)"
                          name={`comment-${item.id}`}
                          id={`comment-${item.id}`}
                          value={comments[item.id] || ""}
                          onChange={(e) =>
                            handleCommentChange(item.id, e.target.value)
                          }
                          style={{
                            width: "100%",
                            minHeight: 100,
                            resize: "vertical",
                          }}
                        ></textarea>
                      </div>
                      <button
                        id={`submit-${item.id}`}
                        onClick={() => submitRating(item.id)}
                        className="submit-rating"
                        disabled={
                          !ratings[item.id] ||
                          ratingSent[item.id] === true ||
                          ratingSent[item.id] === "sending"
                        }
                      >
                        {ratingSent[item.id] === "sending"
                          ? "Enviando..."
                          : "Enviar"}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No hay datos de mantenimiento.</p>
        )}
      </div>
    </div>
  );
};

export default Mantenimiento;
