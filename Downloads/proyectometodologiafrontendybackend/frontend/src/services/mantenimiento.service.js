import axios from "@services/root.service.js";

// Obtener todos los mantenimientos
export async function getMantenimiento() {
  try {
    const response = await axios.get("/mantenimiento");
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener mantenimientos:", error);
    throw error;
  }
}

// Crear un nuevo mantenimiento
export async function createMantenimiento(descripcion) {
  try {
    const response = await axios.post("/mantenimiento", { descripcion });
    return response.data;
  } catch (error) {
    console.error("Error al crear mantenimiento:", error);
    throw error;
  }
}

// Actualizar el estado de un mantenimiento
export async function updateMantenimientoEstado(id, estado) {
  try {
    const response = await axios.put(`/mantenimiento/${id}/estado`, { estado });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar estado de mantenimiento:", error);
    throw error;
  }
}

// Eliminar un mantenimiento
export async function deleteMantenimiento(id) {
  try {
    const response = await axios.delete(`/mantenimiento/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar mantenimiento:", error);
    throw error;
  }
}
