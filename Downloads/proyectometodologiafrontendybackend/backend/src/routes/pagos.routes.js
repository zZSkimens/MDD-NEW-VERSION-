import { Router } from "express";
import {
  obtenerPagosUsuario,
  realizarPago,
  obtenerComprobante,
  crearPago,
  obtenerHistorialPagos,
} from "../controllers/pagos.controller.js";

const router = Router();

router.post("/crear-pago", crearPago);

router.get("/historial", obtenerHistorialPagos);

router.post("/pagar", realizarPago);

router.get("/comprobante/:pagoId", obtenerComprobante);

router.get("/:usuarioId", obtenerPagosUsuario);

export default router;
