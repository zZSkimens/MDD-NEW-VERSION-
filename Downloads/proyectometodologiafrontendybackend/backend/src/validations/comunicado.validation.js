"use strict";
import Joi from "joi";

export const createComunicadoValidation = Joi.object({
  titulo: Joi.string()
    .min(5)
    .max(100)
    .required()
    .messages({
      "string.min": "El título debe tener al menos 5 caracteres.",
      "string.max": "El título no puede exceder los 100 caracteres.",
      "string.empty": "El título es obligatorio.",
    }),
  contenido: Joi.string()
    .min(10)
    .required()
    .messages({
      "string.min": "El contenido debe tener al menos 10 caracteres.",
      "string.empty": "El contenido es obligatorio.",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten campos adicionales",
  });

// Puedes añadir validaciones para actualizar si es necesario, similar a la de registro