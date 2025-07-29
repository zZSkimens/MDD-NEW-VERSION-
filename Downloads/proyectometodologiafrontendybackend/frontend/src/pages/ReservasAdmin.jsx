import React, { useEffect, useState } from "react";
import {
  getAllReservations,
  updateReservationStatus,
} from "@services/reservation.service.js";

const ReservasAdmin = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    setLoading(true);
    getAllReservations()
      .then(setReservas)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [refresh]);

  const handleAprobar = async (id) => {
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

  const handleRechazar = async (id) => {
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

  return (
    <div className="admin-reservas-section">
      <h2>Solicitudes de Reserva</h2>
      {loading && <p>Cargando reservas...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && (
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
                <td>{reserva.user?.nombre || reserva.user?.email}</td>
                <td>{reserva.startDate?.slice(0, 10)}</td>
                <td>{reserva.endDate?.slice(0, 10)}</td>
                <td>{reserva.status}</td>
                <td>
                  {reserva.status === "pending" ? (
                    <>
                      <button
                        onClick={() => handleAprobar(reserva.id)}
                        className="admin-btn editar"
                      >
                        Aprobar
                      </button>
                      <button
                        onClick={() => handleRechazar(reserva.id)}
                        className="admin-btn eliminar danger"
                      >
                        Rechazar
                      </button>
                    </>
                  ) : (
                    <span
                      style={{
                        color:
                          reserva.status === "approved" ? "#219150" : "#c0392b",
                      }}
                    >
                      {reserva.status === "approved" ? "Aprobada" : "Rechazada"}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ReservasAdmin;
