"use strict";

import { EntitySchema } from "typeorm";

export const CommonAreaEntity = new EntitySchema({
  name: "CommonArea",
  tableName: "common_areas",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    name: {
      type: String,
      unique: true,
      nullable: false,
    },
    capacity: {
      type: Number,
      nullable: false,
    },
    status: {
      type: String,
      nullable: false,
      default: "Disponible",
    },
    startDate: {
      type: "date",
      nullable: true,
    },
    endDate: {
      type: "date",
      nullable: true,
    },
    description: {
      type: String,
      nullable: true,
    },
  },
});

export default CommonAreaEntity;
