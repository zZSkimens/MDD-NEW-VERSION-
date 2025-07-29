import { Router } from "express";
import { obtenerEncuestas, crearEncuesta } from "../controllers/encuesta.controller.js";

const router = Router();

// Rutas de encuestas
router.get("/", obtenerEncuestas);
router.post("/", crearEncuesta);

export default router;
