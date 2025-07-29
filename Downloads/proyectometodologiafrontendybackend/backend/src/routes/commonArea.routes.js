import { Router } from "express";
import {
  obtenerAreasComunes,
  obtenerAreaComunPorId,
  crearAreaComun,
  actualizarAreaComunPorId,
  eliminarAreaComunPorId,
} from "../controllers/commonArea.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";

const router = Router();

router.use(authenticateJwt);

router.get("/", obtenerAreasComunes);
router.get("/:id", obtenerAreaComunPorId);

router.post("/", isAdmin, crearAreaComun);
router.put("/:id", isAdmin, actualizarAreaComunPorId);
router.delete("/:id", isAdmin, eliminarAreaComunPorId);

export default router;
