import { Router } from "express";
import {
  crearOpinion,
  listarOpiniones,
  eliminarOpinion,
} from "../controllers/opinion.controller.js";

const router = Router();

router.post("/", crearOpinion); // Registrar opinión
router.get("/", listarOpiniones); // Listar opiniones
router.delete("/:id", eliminarOpinion); // Eliminar opinión

export default router;
