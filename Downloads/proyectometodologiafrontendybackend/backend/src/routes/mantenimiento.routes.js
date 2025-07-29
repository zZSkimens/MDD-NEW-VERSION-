import { Router } from "express";
import {
  obtenerMantenimientos,
  crearMantenimiento,
  actualizarEstadoMantenimiento,
  eliminarMantenimiento,
} from "../controllers/mantenimiento.controller.js";

const router = Router();

// Rutas de mantenimiento
router.get("/", obtenerMantenimientos);
router.post("/", crearMantenimiento);
router.put("/:id/estado", actualizarEstadoMantenimiento);
router.delete("/:id", eliminarMantenimiento);

export default router;
