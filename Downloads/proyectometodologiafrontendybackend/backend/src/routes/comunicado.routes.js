import { Router } from "express";
import {
  createComunicado,
  getComunicados,
  getComunicadoById,
  updateComunicadoById,
  deleteComunicadoById,
} from "../controllers/comunicado.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";

const router = Router();

// Todas las rutas de comunicados requieren autenticación
router.use(authenticateJwt);

// Rutas para administradores (crear, actualizar, eliminar comunicados)
router.post("/", isAdmin, createComunicado); // Solo administradores pueden crear
router.put("/:id", isAdmin, updateComunicadoById); // Solo administradores pueden actualizar (o el autor si no es admin)
router.delete("/:id", isAdmin, deleteComunicadoById); // Solo administradores pueden eliminar (o el autor si no es admin)

// Rutas accesibles por todos los usuarios autenticados (ver comunicados)
router.get("/", getComunicados);
router.get("/:id", getComunicadoById);

export default router;
