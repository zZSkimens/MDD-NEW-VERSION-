import { Router } from "express";
import {
  obtenerRatingPorId,
  crearRating,
  obtenerRatingUsuarioMantenimiento,
} from "../controllers/rating.controller.js";

const router = Router();

// Rutas de rating
router.get(
  "/user/:usuarioId/mantenimiento/:mantenimientoId",
  obtenerRatingUsuarioMantenimiento
);
router.get("/:id", obtenerRatingPorId);
router.post("/", crearRating);

export default router;
