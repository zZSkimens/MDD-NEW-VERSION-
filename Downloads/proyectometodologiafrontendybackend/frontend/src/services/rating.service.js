import axios from "@services/root.service.js";

// Obtener rating de un usuario para un mantenimiento
export async function getUserRating(mantenimientoId, usuarioId) {
  try {
    const response = await axios.get(
      `/ratings/user/${usuarioId}/mantenimiento/${mantenimientoId}`
    );
    return response.data.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw error;
  }
}
