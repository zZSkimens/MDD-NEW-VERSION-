"use strict";

import { EntitySchema } from "typeorm";

export const EncuestaEntity = new EntitySchema({
  name: "Encuesta",
  tableName: "encuestas",
  columns: {
    id: { type: Number, primary: true, generated: true },
    usuarioId: { type: Number, nullable: false },
    mantenimientoId: { type: Number, nullable: false },
    calificacion: { type: Number, nullable: false }, // 1-5
    comentario: { type: String, nullable: true },
    creadoEn: { type: "timestamp", default: () => "CURRENT_TIMESTAMP" },
  },
});

export default EncuestaEntity;
