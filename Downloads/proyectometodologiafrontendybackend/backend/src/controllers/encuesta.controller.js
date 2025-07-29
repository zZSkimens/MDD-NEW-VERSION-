"use strict";

import Encuesta from "../entity/encuesta.entity.js";
import { AppDataSource } from "../config/configDb.js";

// Obtener todas las encuestas
export async function obtenerEncuestas(req, res) {
  try {
    const repo = AppDataSource.getRepository(Encuesta);
    const encuestas = await repo.find();
    res.status(200).json({ message: "Encuestas encontradas", data: encuestas });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor", error });
  }
}

// Crear una nueva encuesta
export async function crearEncuesta(req, res) {
  try {
    const { usuarioId, mantenimientoId, calificacion, comentario } = req.body;
    if (!usuarioId || !mantenimientoId || !calificacion)
      return res
        .status(400)
        .json({
          message: "usuarioId, mantenimientoId y calificacion son obligatorios",
        });
    const repo = AppDataSource.getRepository(Encuesta);
    const nueva = repo.create({
      usuarioId,
      mantenimientoId,
      calificacion,
      comentario,
    });
    await repo.save(nueva);
    res.status(201).json({ message: "Encuesta creada", data: nueva });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor", error });
  }
}
