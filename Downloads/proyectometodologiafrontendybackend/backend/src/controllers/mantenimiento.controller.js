"use strict";

import Mantenimiento from "../entity/mantenimiento.entity.js";
import { AppDataSource } from "../config/configDb.js";

// Obtener todos los mantenimientos
export async function obtenerMantenimientos(req, res) {
  try {
    const repo = AppDataSource.getRepository(Mantenimiento);
    const mantenimientos = await repo.find();
    res
      .status(200)
      .json({ message: "Mantenimientos encontrados", data: mantenimientos });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor", error });
  }
}

// Crear un nuevo mantenimiento
export async function crearMantenimiento(req, res) {
  try {
    const { descripcion } = req.body;
    if (!descripcion)
      return res.status(400).json({ message: "La descripción es obligatoria" });
    const repo = AppDataSource.getRepository(Mantenimiento);
    const nuevo = repo.create({ descripcion });
    await repo.save(nuevo);
    res.status(201).json({ message: "Mantenimiento creado", data: nuevo });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor", error });
  }
}

// Actualizar el estado de un mantenimiento
export async function actualizarEstadoMantenimiento(req, res) {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const repo = AppDataSource.getRepository(Mantenimiento);
    const mantenimiento = await repo.findOne({ where: { id } });
    if (!mantenimiento)
      return res.status(404).json({ message: "Mantenimiento no encontrado" });
    mantenimiento.estado = estado || mantenimiento.estado;
    await repo.save(mantenimiento);
    res
      .status(200)
      .json({ message: "Estado actualizado", data: mantenimiento });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor", error });
  }
}

// Eliminar un mantenimiento
export async function eliminarMantenimiento(req, res) {
  try {
    const { id } = req.params;
    const repo = AppDataSource.getRepository(Mantenimiento);
    const mantenimiento = await repo.findOne({ where: { id } });
    if (!mantenimiento)
      return res.status(404).json({ message: "Mantenimiento no encontrado" });
    await repo.remove(mantenimiento);
    res.status(200).json({ message: "Mantenimiento eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor", error });
  }
}
