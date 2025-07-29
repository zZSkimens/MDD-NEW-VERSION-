import { METODOS_VALIDOS } from "../helpers/metodosPago.js";

export const validarMetodoPago = (req, res, next) => {
  const { metodoPago } = req.body;
  if (!METODOS_VALIDOS.includes(metodoPago)) {
    return res.status(400).json({ mensaje: "Método de pago no válido." });
  }
  next();

  return res.status(200).json({ mensaje: "Pago registrado correctamente.", metodoValido: req.mensajeMetodo, pago});
};
