"use strict";

import { EntitySchema } from "typeorm";

export const MantenimientoEntity = new EntitySchema({
  name: "Mantenimiento",
  tableName: "mantenimientos",
  columns: {
    id: { type: Number, primary: true, generated: true },
    descripcion: { type: String, nullable: false },
    estado: { type: String, default: "no iniciado" }, // no iniciado, pendiente, en proceso, terminado
    creadoEn: { type: "date", default: () => "CURRENT_DATE" },
    actualizadoEn: {
      type: "date",
      default: () => "CURRENT_DATE",
      onUpdate: () => "CURRENT_DATE",
    },
  },
});

export default MantenimientoEntity;
