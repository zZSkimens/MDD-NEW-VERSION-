import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const createReservation = async (reservation) => {
  const token = sessionStorage.getItem("token");
  const res = await axios.post(`${API_URL}/reservas`, reservation, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.datos;
};

export const getMyReservations = async () => {
  const token = sessionStorage.getItem("token");
  const res = await axios.get(`${API_URL}/reservas/mis-reservas`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.datos;
};

export const getAvailableAreas = async (startDate, endDate) => {
  const token = sessionStorage.getItem("token");
  const res = await axios.get(`${API_URL}/reservas/disponibles`, {
    params: { fechaInicio: startDate, fechaFin: endDate },
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.disponibles;
};

export const getAllReservations = async () => {
  const token = sessionStorage.getItem("token");
  const res = await axios.get(`${API_URL}/reservas`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.datos;
};

export const updateReservationStatus = async (id, estado) => {
  const token = sessionStorage.getItem("token");
  const res = await axios.patch(
    `${API_URL}/reservas/${id}/estado`,
    { estado },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data.datos;
};
