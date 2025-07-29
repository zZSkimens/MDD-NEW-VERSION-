"use strict";

import { EntitySchema } from "typeorm";

export const RatingEntity = new EntitySchema({
  name: "Rating",
  tableName: "ratings",
  columns: {
    id: { type: Number, primary: true, generated: true },
    mantenimientoId: { type: Number, nullable: false },
    usuarioId: { type: Number, nullable: false }, // id del usuario que califica
    rating: { type: Number, nullable: false }, // rating value 1-5
    comments: { type: String, default: "" }, // comments about the rating
    submitDate: { type: "date", default: () => "CURRENT_DATE" },
  },
});

export default RatingEntity;
