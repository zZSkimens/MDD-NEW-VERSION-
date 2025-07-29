"use strict";

import { EntitySchema } from "typeorm";

export const ComunicadoEntity = new EntitySchema({
  name: "Comunicado",
  tableName: "comunicados",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    titulo: {
      type: String,
      nullable: false,
    },
    contenido: {
      type: String,
      nullable: false,
    },
    fechaPublicacion: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
  },
  relations: {
    autor: {
      target: "User",
      type: "many-to-one",
      joinColumn: { name: "autorId" },
      onDelete: "CASCADE",
    },
  },
});

export default ComunicadoEntity;
