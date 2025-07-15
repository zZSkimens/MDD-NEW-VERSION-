"use strict";
import Joi from "joi";

export const createAnnouncementValidation = Joi.object({
    title: Joi.string()
        .min(3)
        .max(100)
        .required()
        .messages({
            "string.empty": "El título no puede estar vacío.",
            "string.min": "El título debe tener al menos 3 caracteres.",
            "string.max": "El título no puede exceder los 100 caracteres.",
            "any.required": "El título es obligatorio.",
        }),
    message: Joi.string()
        .min(10)
        .required()
        .messages({
            "string.empty": "El mensaje no puede estar vacío.",
            "string.min": "El mensaje debe tener al menos 10 caracteres.",
            "any.required": "El mensaje es obligatorio.",
        }),
    targetGroups: Joi.array()
        .items(Joi.string().valid("administrador", "usuario"))
        .min(1)
        .required()
        .messages({
            "array.base": "Los grupos de destino deben ser un array.",
            "array.min": "Debe seleccionar al menos un grupo de destino.",
            "any.required": "Los grupos de destino son obligatorios.",
            "any.only": "Uno o más roles seleccionados no son válidos.",
        }),
    attachments: Joi.array().items(Joi.string().uri()).optional().messages({
        "array.base": "Los adjuntos deben ser un array de URLs.",
        "string.uri": "La URL del adjunto no es válida.",
    }),
    scheduledSendAt: Joi.date().iso().greater("now").optional().messages({
        "date.iso": "La fecha de programación debe ser una fecha ISO válida.",
        "date.greater": "La fecha de programación debe ser en el futuro.",
    }),
}).unknown(false).messages({
    "object.unknown": "No se permiten campos adicionales para el comunicado.",
});

export const submitOpinionValidation = Joi.object({
    opinion: Joi.string()
        .min(5)
        .max(500)
        .required()
        .messages({
            "string.empty": "La opinión no puede estar vacía.",
            "string.min": "La opinión debe tener al menos 5 caracteres.",
            "string.max": "La opinión no puede exceder los 500 caracteres.",
            "any.required": "La opinión es obligatoria.",
        }),
}).unknown(false).messages({
    "object.unknown": "No se permiten campos adicionales para la opinión.",
});