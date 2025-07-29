import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const getAreasComunes = async () => {
  const token = sessionStorage.getItem("token");
  const res = await axios.get(`${API_URL}/common-area`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.datos;
};

export const createAreaComun = async (area) => {
  const token = sessionStorage.getItem("token");
  const res = await axios.post(`${API_URL}/common-area`, area, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.datos;
};

export const updateAreaComun = async (id, area) => {
  const token = sessionStorage.getItem("token");
  const res = await axios.put(`${API_URL}/common-area/${id}`, area, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.datos;
};

export const deleteAreaComun = async (id) => {
  const token = sessionStorage.getItem("token");
  await axios.delete(`${API_URL}/common-area/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
