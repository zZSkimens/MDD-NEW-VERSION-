"use strict";

import { EntitySchema } from "typeorm";

export const ReporteEntity = new EntitySchema({
  name: "Reporte",
  tableName: "reportes",
  columns: {
    id: { type: Number, primary: true, generated: true },
    usuarioId: { type: Number, nullable: false },
    titulo: { type: String, nullable: false },
    descripcion: { type: String, nullable: false },
    estado: { type: String, default: "pendiente" }, // pendiente, en proceso, resuelto
    creadoEn: { type: "timestamp", default: () => "CURRENT_TIMESTAMP" },
    actualizadoEn: { type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: () => "CURRENT_TIMESTAMP" },
  },
});

export default ReporteEntity;
