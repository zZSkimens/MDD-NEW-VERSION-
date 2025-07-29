"use strict";
import AreaComun from "../entity/commonArea.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function obtenerAreasComunes(req, res) {
  try {
    const repositorioAreaComun = AppDataSource.getRepository(AreaComun);
    const areasComunes = await repositorioAreaComun.find();
    function parseDateString(str) {
      if (!str) return null;
      const [year, month, day] = str.split("-").map(Number);
      return new Date(year, month - 1, day);
    }
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const actualizadas = areasComunes.map((area) => {
      if (area.startDate) {
        const inicio = parseDateString(area.startDate);
        if (hoy < inicio) {
          area.status = "Disponible";
        } else {
          area.status = "No disponible";
        }
      } else {
        area.status = "No disponible";
      }
      return area;
    });
    res
      .status(200)
      .json({ mensaje: "Áreas comunes encontradas: ", datos: actualizadas });
  } catch (error) {
    console.error(
      "Error en commonArea.controller.js -> obtenerAreasComunes(): ",
      error
    );
    res.status(500).json({ mensaje: "Error interno del servidor." });
  }
}

export async function obtenerAreaComunPorId(req, res) {
  try {
    const repositorioAreaComun = AppDataSource.getRepository(AreaComun);
    const { id } = req.params;
    const areaComun = await repositorioAreaComun.findOne({ where: { id } });

    if (!areaComun) {
      return res.status(404).json({ mensaje: "Área común no encontrada." });
    }
    res
      .status(200)
      .json({ mensaje: "Área común encontrada: ", datos: areaComun });
  } catch (error) {
    console.error(
      "Error en commonArea.controller.js -> obtenerAreaComunPorId(): ",
      error
    );
    res.status(500).json({ mensaje: "Error interno del servidor." });
  }
}

export async function crearAreaComun(req, res) {
  try {
    const repositorioAreaComun = AppDataSource.getRepository(AreaComun);
    const { name, capacity, description, startDate, endDate } = req.body;
    // Nuevos campos
    const status = "Disponible";

    const areaExistente = await repositorioAreaComun.findOne({
      where: { name },
    });
    if (areaExistente) {
      return res
        .status(409)
        .json({ mensaje: "Ya existe un área común con ese nombre." });
    }

    const nuevaAreaComun = repositorioAreaComun.create({
      name,
      capacity,
      description,
      status,
      startDate: startDate || null,
      endDate: endDate || null,
    });
    await repositorioAreaComun.save(nuevaAreaComun);

    res.status(201).json({
      mensaje: "Área común creada exitosamente!",
      datos: nuevaAreaComun,
    });
  } catch (error) {
    console.error(
      "Error en commonArea.controller.js -> crearAreaComun(): ",
      error
    );
    res.status(500).json({ mensaje: "Error al crear el área común." });
  }
}

export async function actualizarAreaComunPorId(req, res) {
  try {
    const repositorioAreaComun = AppDataSource.getRepository(AreaComun);
    const { id } = req.params;
    const { nombre, capacidad, descripcion, status, startDate, endDate } =
      req.body;
    const areaComun = await repositorioAreaComun.findOne({ where: { id } });

    if (!areaComun) {
      return res.status(404).json({ mensaje: "Área común no encontrada." });
    }

    if (nombre && nombre !== areaComun.name) {
      const areaExistente = await repositorioAreaComun.findOne({
        where: { nombre },
      });
      if (areaExistente) {
        return res
          .status(409)
          .json({ mensaje: "Ya existe un área común con ese nombre." });
      }
    }

    areaComun.name = nombre || areaComun.name;
    areaComun.capacity = capacidad || areaComun.capacity;
    areaComun.description = descripcion || areaComun.description;
    if (status) areaComun.status = status;
    // Eliminado manejo de occupied
    if (typeof startDate !== "undefined")
      areaComun.startDate = startDate || null;
    if (typeof endDate !== "undefined") areaComun.endDate = endDate || null;

    await repositorioAreaComun.save(areaComun);
    res.status(200).json({
      mensaje: "Área común actualizada exitosamente.",
      datos: areaComun,
    });
  } catch (error) {
    console.error(
      "Error en commonArea.controller.js -> actualizarAreaComunPorId(): ",
      error
    );
    res.status(500).json({ mensaje: "Error interno del servidor." });
  }
}

export async function eliminarAreaComunPorId(req, res) {
  try {
    const repositorioAreaComun = AppDataSource.getRepository(AreaComun);
    const { id } = req.params;
    const areaComun = await repositorioAreaComun.findOne({ where: { id } });

    if (!areaComun) {
      return res.status(404).json({ mensaje: "Área común no encontrada." });
    }

    await repositorioAreaComun.remove(areaComun);
    res.status(200).json({ mensaje: "Área común eliminada exitosamente." });
  } catch (error) {
    console.error(
      "Error en commonArea.controller.js -> eliminarAreaComunPorId(): ",
      error
    );
    res.status(500).json({ mensaje: "Error interno del servidor." });
  }
}
