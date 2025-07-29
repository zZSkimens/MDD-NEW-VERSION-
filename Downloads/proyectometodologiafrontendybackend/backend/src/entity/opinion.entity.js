import { EntitySchema } from "typeorm";

export const OpinionEntity = new EntitySchema({
  name: "Opinion",
  tableName: "opinions",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    opinion: {
      type: "varchar",
      nullable: false,
    },
    fecha: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
  },
});

export default { OpinionEntity };
