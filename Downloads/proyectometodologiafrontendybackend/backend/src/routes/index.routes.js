import { Router } from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import mantenimientoRoutes from "./mantenimiento.routes.js";
import ratingRoutes from "./rating.routes.js";
import pagosRoutes from "./pagos.routes.js";
import commonAreaRoutes from "./commonArea.routes.js";
import comunicadoRoutes from "./comunicado.routes.js";
import encuestaRoutes from "./encuesta.routes.js";
import reporteRoutes from "./reporte.routes.js";
import reservationRoutes from "./reservation.routes.js";
import opinionRoutes from "./opinion.routes.js";

const router = new Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/mantenimiento", mantenimientoRoutes);
router.use("/ratings", ratingRoutes);
router.use("/pagos", pagosRoutes);

router.use("/common-area", commonAreaRoutes);
router.use("/comunicados", comunicadoRoutes);
router.use("/encuestas", encuestaRoutes);
router.use("/reportes", reporteRoutes);
router.use("/reservas", reservationRoutes);
router.use("/opiniones", opinionRoutes);

export default router;
