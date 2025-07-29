import { AppDataSource } from "../config/configDb.js";
import { Pago } from "../entity/pagos.entity.js";

const repositorioPago = AppDataSource.getRepository(Pago);

//obtener todos los historial de pagos de todos los usuarios
export const obtenerHistorialPagos = async (req, res) => {
  try {
    const pagos = await repositorioPago.find();
    return res.status(200).json(pagos);
  } catch (error) {
    return res.status(500).json({ mensaje: "Error interno del servidor." });
  }
};

export const obtenerPagosUsuario = async (req, res) => {
  const { usuarioId } = req.params;
  try {
    const pagos = await repositorioPago.find({ where: { usuarioId } });
    if (pagos.length === 0) {
      return res
        .status(200)
        .json({ mensaje: "No se encontraron pagos para este usuario." });
    }
    return res.status(200).json(pagos);
  } catch (error) {
    return res.status(500).json({ mensaje: "Error interno del servidor." });
  }
};

export const realizarPago = async (req, res) => {
  const { usuarioId, pagoId, metodoPago } = req.body;
  try {
    const pago = await repositorioPago.findOne({
      where: { id: pagoId, usuarioId },
    });
    if (!pago) {
      return res
        .status(404)
        .json({ mensaje: "Pago no encontrado para este usuario." });
    }
    if (pago.estado === "pagado") {
      return res
        .status(400)
        .json({ mensaje: "Este pago ya ha sido realizado previamente." });
    }
    pago.estado = "pagado";
    pago.fechaPago = new Date();
    pago.metodoPago = metodoPago;
    await repositorioPago.save(pago);
    return res
      .status(200)
      .json({ mensaje: "Pago realizado correctamente.", pago });
  } catch (error) {
    return res
      .status(500)
      .json({ mensaje: "No se pudo registrar el pago. Inténtalo más tarde." });
  }
};

export const obtenerComprobante = async (req, res) => {
  const { pagoId } = req.params;
  try {
    const pago = await repositorioPago.findOne({ where: { id: pagoId } });
    if (!pago || pago.estado !== "pagado") {
      return res.status(404).json({
        mensaje: "Comprobante no disponible. El pago no se ha realizado.",
      });
    }
    const comprobante = {
      numero: pago.id,
      usuarioId: pago.usuarioId,
      monto: pago.monto,
      fechaPago: pago.fechaPago,
      metodoPago: pago.metodoPago,
    };
    return res.status(200).json({ comprobante });
  } catch (error) {
    return res
      .status(500)
      .json({ mensaje: "No se pudo obtener el comprobante del pago." });
  }
};

export const crearPago = async (req, res) => {
  const { usuarioId, monto, fechaLimite } = req.body;
  try {
    const nuevoPago = repositorioPago.create({
      usuarioId,
      monto,
      fechaLimite,
      estado: "pendiente",
    });
    await repositorioPago.save(nuevoPago);
    return res
      .status(201)
      .json({ mensaje: "Pago creado correctamente.", pago: nuevoPago });
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al crear el pago." });
  }
};

export default {
  obtenerPagosUsuario,
  realizarPago,
  obtenerComprobante,
  crearPago,
};
