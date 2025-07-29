"use strict";
import { Router } from "express";
import {
  obtenerReservas,
  obtenerReservaPorId,
  crearReserva,
  actualizarEstadoReserva,
  eliminarReservaPorId,
  obtenerReservasUsuario,
  obtenerAreasComunesDisponibles,
} from "../controllers/reservation.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";

const router = Router();


router.use(authenticateJwt);


router.get("/mis-reservas", obtenerReservasUsuario); 
router.get("/disponibles", obtenerAreasComunesDisponibles); 
router.post("/", crearReserva); 


router.get("/", isAdmin, obtenerReservas); 
router.get("/:id", isAdmin, obtenerReservaPorId); 
router.patch("/:id/estado", isAdmin, actualizarEstadoReserva); 
router.delete("/:id", isAdmin, eliminarReservaPorId); 

export default router;