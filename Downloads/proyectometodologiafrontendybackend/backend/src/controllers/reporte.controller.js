"use strict";

import Reporte from "../entity/reporte.entity.js";
import { AppDataSource } from "../config/configDb.js";

// Obtener todos los reportes
export async function obtenerReportes(req, res) {
  try {
    const repo = AppDataSource.getRepository(Reporte);
    const reportes = await repo.find();
    res.status(200).json({ message: "Reportes encontrados", data: reportes });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor", error });
  }
}

// Crear un nuevo reporte
export async function crearReporte(req, res) {
  try {
    const { usuarioId, titulo, descripcion } = req.body;
    if (!usuarioId || !titulo || !descripcion)
      return res
        .status(400)
        .json({ message: "usuarioId, titulo y descripcion son obligatorios" });
    const repo = AppDataSource.getRepository(Reporte);
    const nuevo = repo.create({ usuarioId, titulo, descripcion });
    await repo.save(nuevo);
    res.status(201).json({ message: "Reporte creado", data: nuevo });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor", error });
  }
}

// Actualizar el estado de un reporte
export async function actualizarEstadoReporte(req, res) {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const repo = AppDataSource.getRepository(Reporte);
    const reporte = await repo.findOne({ where: { id } });
    if (!reporte)
      return res.status(404).json({ message: "Reporte no encontrado" });
    reporte.estado = estado || reporte.estado;
    await repo.save(reporte);
    res.status(200).json({ message: "Estado actualizado", data: reporte });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor", error });
  }
}
