import { Router } from "express";
import { obtenerReportes, crearReporte, actualizarEstadoReporte } from "../controllers/reporte.controller.js";

const router = Router();

// Rutas de reportes
router.get("/", obtenerReportes);
router.post("/", crearReporte);
router.put("/:id/estado", actualizarEstadoReporte);

export default router;
