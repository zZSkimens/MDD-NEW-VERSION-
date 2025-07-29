// Obtener rating de un usuario para un mantenimiento
export async function obtenerRatingUsuarioMantenimiento(req, res) {
  try {
    const { usuarioId, mantenimientoId } = req.params;
    const repo = AppDataSource.getRepository(RatingEntity);
    const rating = await repo.findOne({
      where: { usuarioId, mantenimientoId },
    });
    if (!rating) {
      return res.status(304).json({ message: "Rating no encontrado" });
    }
    res.status(200).json({ message: "Rating encontrado", data: rating });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor", error });
  }
}
("use strict");

import RatingEntity from "../entity/rating.entity.js";
import { AppDataSource } from "../config/configDb.js";

// Obtener rating por id
export async function obtenerRatingPorId(req, res) {
  try {
    const { id } = req.params;
    const repo = AppDataSource.getRepository(RatingEntity);
    const rating = await repo.findOne({ where: { id } });
    if (!rating)
      return res.status(404).json({ message: "Rating no encontrado" });
    res.status(200).json({ message: "Rating encontrado", data: rating });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor", error });
  }
}

// Crear rating (solo uno por usuario y mantenimiento)
export async function crearRating(req, res) {
  try {
    const repo = AppDataSource.getRepository(RatingEntity);
    const { mantenimientoId, rating, comments } = req.body;
    // Obtener usuarioId desde sesión/token o body (ajustar según tu auth)
    let usuarioId = null;
    if (req.user && req.user.id) {
      usuarioId = req.user.id;
    } else if (req.body.usuarioId) {
      usuarioId = req.body.usuarioId;
    }
    if (!usuarioId) {
      return res.status(400).json({ message: "Usuario no autenticado" });
    }
    // Verificar si ya existe rating para este usuario y mantenimiento
    const existing = await repo.findOne({
      where: { mantenimientoId, usuarioId },
    });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Ya has calificado este mantenimiento" });
    }
    const newRating = repo.create({
      mantenimientoId,
      usuarioId,
      rating,
      comments,
    });
    const savedRating = await repo.save(newRating);
    res.status(201).json({ message: "Rating creado", data: savedRating });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el rating", error });
  }
}
