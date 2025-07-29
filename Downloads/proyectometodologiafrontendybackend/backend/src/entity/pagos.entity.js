import { EntitySchema } from "typeorm";

export const Pago = new EntitySchema({
  name: "Pago",
  tableName: "pagos",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    usuarioId: {
      type: "int",
    },
    monto: {
      type: "float",
    },
    fechaLimite: {
      type: "date",
    },
    fechaPago: {
      type: "date",
      nullable: true,
    },
    estado: {
      type: "varchar",
      default: "pendiente", // pagado | pendiente | vencido
    },
    metodoPago: {
      type: "varchar",
      nullable: true,
    },
  },
});

export default Pago;
