import React, { useState } from "react";
import {
  createReservation,
  getAllReservations,
  updateReservationStatus,
  getMyReservations,
} from "@services/reservation.service.js";
import "@styles/zonasComunes.css";
import useGetAreasComunes from "@hooks/areas/useGetAreasComunes.jsx";
import { useAuth } from "@context/AuthContext.jsx";
import {
  createAreaComun,
  updateAreaComun,
  deleteAreaComun,
} from "@services/commonArea.service.js";

const initialForm = {
  nombre: "",
  capacidad: "",
  descripcion: "",
  fechaInicio: "",
  fechaFin: "",
};

const ZonasComunes = () => {
  const { areas, loading, error } = useGetAreasComunes();
  const { user } = useAuth();
  const isAdmin = user?.rol === "administrador";
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [localAreas, setLocalAreas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [reservas, setReservas] = useState([]);
  const [loadingReservas, setLoadingReservas] = useState(true);
  const [errorReservas, setErrorReservas] = useState("");

  // Sincroniza areas del hook con el estado local para refrescar tras CRUD
  React.useEffect(() => {
    setLocalAreas(areas);
  }, [areas]);

  // Forzar recarga tras CRUD
  React.useEffect(() => {
    if (refresh) {
      setRefresh(false);
      window.location.reload();
    }
  }, [refresh]);

  React.useEffect(() => {
    if (isAdmin) {
      setLoadingReservas(true);
      getAllReservations()
        .then(setReservas)
        .catch((e) => setErrorReservas(e.message))
        .finally(() => setLoadingReservas(false));
    }
  }, [refresh, isAdmin]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Transformar campos a los que espera el backend
    const areaToSend = {
      name: form.nombre,
      capacity: form.capacidad,
      description: form.descripcion,
      startDate: form.fechaInicio || null,
      endDate: form.fechaFin || null,
    };
    try {
      if (editId) {
        await updateAreaComun(editId, areaToSend);
      } else {
        await createAreaComun(areaToSend);
      }
      setForm(initialForm);
      setEditId(null);
      setRefresh(true);
    } catch (err) {
      alert(
        "Error guardando área: " + (err?.response?.data?.mensaje || err.message)
      );
    }
  };

  const handleEdit = (area) => {
    setEditId(area.id);
    setForm({
      nombre: area.name,
      capacidad: area.capacity,
      descripcion: area.description,
      fechaInicio: area.startDate ? area.startDate.slice(0, 10) : "",
      fechaFin: area.endDate ? area.endDate.slice(0, 10) : "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta área común?")) return;
    try {
      await deleteAreaComun(id);
      setRefresh(true);
    } catch (err) {
      alert(
        "Error eliminando área: " + err?.response?.data?.mensaje || err.message
      );
    }
  };

  const handleAprobarReserva = async (id) => {
    try {
      await updateReservationStatus(id, "approved");
      setRefresh((r) => !r);
    } catch (err) {
      alert(
        "Error aprobando reserva: " +
          (err?.response?.data?.mensaje || err.message)
      );
    }
  };

  const handleRechazarReserva = async (id) => {
    try {
      await updateReservationStatus(id, "rejected");
      setRefresh((r) => !r);
    } catch (err) {
      alert(
        "Error rechazando reserva: " +
          (err?.response?.data?.mensaje || err.message)
      );
    }
  };

  // Componente para reservar área (solo usuarios)
  function BotonReservar({ area, onReservado }) {
    const [loading, setLoading] = React.useState(false);
    const [msg, setMsg] = React.useState("");
    const [reservaPendiente, setReservaPendiente] = React.useState(false);
    const [reservaAprobada, setReservaAprobada] = React.useState(false);

    React.useEffect(() => {
      // Obtener reservas del usuario para esta área y fechas
      getMyReservations().then((reservas) => {
        const reserva = reservas.find(
          (r) =>
            r.commonArea?.id === area.id &&
            r.startDate?.slice(0, 10) === area.startDate?.slice(0, 10) &&
            r.endDate?.slice(0, 10) === area.endDate?.slice(0, 10)
        );
        if (reserva) {
          setReservaPendiente(reserva.status === "pending");
          setReservaAprobada(reserva.status === "approved");
        } else {
          setReservaPendiente(false);
          setReservaAprobada(false);
        }
      });
    }, [area.id, area.startDate, area.endDate]);

    const handleReserva = async () => {
      setLoading(true);
      setMsg("");
      try {
        await createReservation({
          idAreaComun: area.id,
          fechaInicio: area.startDate,
          fechaFin: area.endDate,
        });
        setMsg("Reserva solicitada (pendiente de aprobación)");
        if (onReservado) onReservado();
      } catch (err) {
        setMsg(err?.response?.data?.mensaje || "Error al reservar");
      } finally {
        setLoading(false);
      }
    };

    if (reservaAprobada) {
      return (
        <div style={{ color: "#219150", fontWeight: "bold", marginTop: 8 }}>
          RESERVADA
        </div>
      );
    }
    if (reservaPendiente) {
      return (
        <div style={{ color: "#f39c12", fontWeight: "bold", marginTop: 8 }}>
          Solicitud pendiente
        </div>
      );
    }
    return (
      <>
        <button
          onClick={handleReserva}
          disabled={loading || reservaPendiente}
          style={{ marginTop: 4 }}
        >
          Reservar
        </button>
        {msg && <div style={{ fontSize: 12 }}>{msg}</div>}
      </>
    );
  }

  return (
    <div className="areas-section">
      <h2>Zonas Comunes</h2>
      {loading && <p>Cargando áreas...</p>}
      {error && <p className="error">Error: {error.message}</p>}
      {!loading && !error && (
        <>
          {/* Vista tipo catálogo para usuarios */}
          {!isAdmin ? (
            <div className="catalogo-areas">
              {localAreas?.length === 0 && (
                <div className="catalogo-vacio">
                  No hay áreas comunes registradas.
                </div>
              )}
              {localAreas?.map((area) => (
                <div className="area-card" key={area.id}>
                  <div className="area-card-header">
                    <h3>{area.name}</h3>
                  </div>
                  <div className="area-card-body">
                    <div className="area-card-info">
                      <span className="area-capacidad">
                        Capacidad: {area.capacity}
                      </span>
                      <span className="area-estado">
                        Estado: <b>{area.status}</b>
                      </span>
                      <span className="area-disponibilidad">
                        Disponibilidad:{" "}
                        {area.startDate && area.endDate
                          ? `${area.startDate.slice(
                              0,
                              10
                            )} al ${area.endDate.slice(0, 10)}`
                          : "Sin definir"}
                      </span>
                    </div>
                    <div className="area-card-desc">{area.description}</div>
                  </div>
                  {area.status === "Disponible" &&
                  area.startDate &&
                  area.endDate ? (
                    <div className="area-card-actions">
                      <BotonReservar
                        area={area}
                        onReservado={() => setRefresh(true)}
                      />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            // Vista tabla para admin
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginBottom: 16,
                }}
              >
                <button
                  className="admin-btn editar"
                  onClick={() => {
                    setEditId(null);
                    setForm(initialForm);
                    setShowModal(true);
                  }}
                >
                  + Nueva Área
                </button>
              </div>
              <div className="admin-areas-table-wrapper">
                <table className="areas-table admin-table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Capacidad</th>
                      <th>Estado</th>
                      <th>Disponibilidad</th>
                      <th>Descripción</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {localAreas?.length === 0 && (
                      <tr>
                        <td colSpan={6}>No hay áreas comunes registradas.</td>
                      </tr>
                    )}
                    {localAreas?.map((area) => {
                      // Buscar reserva aprobada para esta área
                      const reservaAprobada = reservas?.find(
                        (r) =>
                          r.commonArea?.id === area.id &&
                          r.status === "approved"
                      );
                      let estadoMostrar = area.status;
                      if (reservaAprobada) {
                        estadoMostrar = `Reservada por ${
                          reservaAprobada.user?.nombre ||
                          reservaAprobada.user?.email ||
                          "usuario"
                        }`;
                      }
                      return (
                        <tr key={area.id} className="admin-area-row">
                          <td className="admin-area-nombre">{area.name}</td>
                          <td className="admin-area-capacidad">
                            {area.capacity}
                          </td>
                          <td
                            className={
                              area.status === "Disponible"
                                ? "admin-area-estado disponible"
                                : area.status === "Ocupado"
                                ? "admin-area-estado ocupado"
                                : "admin-area-estado"
                            }
                          >
                            {estadoMostrar}
                          </td>
                          <td className="admin-area-disponibilidad">
                            {area.startDate && area.endDate ? (
                              <span className="admin-fechas">
                                {area.startDate.slice(0, 10)}
                                <br />
                                al
                                <br />
                                {area.endDate.slice(0, 10)}
                              </span>
                            ) : (
                              <span className="admin-fechas indefinido">
                                Sin definir
                              </span>
                            )}
                          </td>
                          <td className="admin-area-desc">
                            {area.description}
                          </td>
                          <td className="admin-area-acciones">
                            <div className="admin-btn-group">
                              <button
                                onClick={() => handleEdit(area)}
                                className="admin-btn editar"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => handleDelete(area.id)}
                                className="admin-btn eliminar danger"
                              >
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {showModal && (
                <div
                  className="modal-backdrop"
                  onClick={() => {
                    setShowModal(false);
                    setEditId(null);
                    setForm(initialForm);
                  }}
                >
                  <div
                    className="modal-area-form"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3
                      style={{
                        textAlign: "center",
                        color: "#2d3a4a",
                        marginBottom: 16,
                      }}
                    >
                      {editId ? "Editar Área" : "Agregar Nueva Área"}
                    </h3>
                    <form className="area-form" onSubmit={handleSubmit}>
                      <input
                        type="text"
                        name="nombre"
                        placeholder="Nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        required
                      />
                      <input
                        type="number"
                        name="capacidad"
                        placeholder="Capacidad"
                        value={form.capacidad}
                        onChange={handleChange}
                        min="1"
                      />
                      <input
                        type="text"
                        name="descripcion"
                        placeholder="Descripción"
                        value={form.descripcion}
                        onChange={handleChange}
                      />
                      <label style={{ fontSize: 14, marginTop: 8 }}>
                        Fecha de inicio de disponibilidad
                      </label>
                      <input
                        type="date"
                        name="fechaInicio"
                        value={form.fechaInicio}
                        onChange={handleChange}
                      />
                      <label style={{ fontSize: 14 }}>
                        Fecha de fin de disponibilidad
                      </label>
                      <input
                        type="date"
                        name="fechaFin"
                        value={form.fechaFin}
                        onChange={handleChange}
                      />
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          marginTop: 16,
                          justifyContent: "center",
                        }}
                      >
                        <button type="submit">
                          {editId ? "Actualizar" : "Agregar"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditId(null);
                            setForm(initialForm);
                            setShowModal(false);
                          }}
                          style={{ background: "#b2bec3" }}
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
              {isAdmin && (
                <div className="admin-reservas-section">
                  <h2>Solicitudes de Reserva</h2>
                  {loadingReservas && <p>Cargando reservas...</p>}
                  {errorReservas && <p className="error">{errorReservas}</p>}
                  {!loadingReservas && !errorReservas && (
                    <table className="areas-table admin-table">
                      <thead>
                        <tr>
                          <th>Área</th>
                          <th>Usuario</th>
                          <th>Inicio</th>
                          <th>Fin</th>
                          <th>Estado</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reservas.length === 0 && (
                          <tr>
                            <td colSpan={6}>No hay reservas pendientes.</td>
                          </tr>
                        )}
                        {reservas.map((reserva) => (
                          <tr key={reserva.id}>
                            <td>{reserva.commonArea?.name}</td>
                            <td>
                              {reserva.user?.nombre || reserva.user?.email}
                            </td>
                            <td>{reserva.startDate?.slice(0, 10)}</td>
                            <td>{reserva.endDate?.slice(0, 10)}</td>
                            <td>{reserva.status}</td>
                            <td>
                              {reserva.status === "pending" ? (
                                <>
                                  <button
                                    onClick={() =>
                                      handleAprobarReserva(reserva.id)
                                    }
                                    className="admin-btn editar"
                                  >
                                    Aprobar
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleRechazarReserva(reserva.id)
                                    }
                                    className="admin-btn eliminar danger"
                                  >
                                    Rechazar
                                  </button>
                                </>
                              ) : (
                                <span
                                  style={{
                                    color:
                                      reserva.status === "approved"
                                        ? "#219150"
                                        : "#c0392b",
                                  }}
                                >
                                  {reserva.status === "approved"
                                    ? "Aprobada"
                                    : "Rechazada"}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ZonasComunes;
