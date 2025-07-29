"use strict";
import Comunicado from "../entity/comunicado.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { createComunicadoValidation } from "../validations/comunicado.validation.js";

// Controlador para comunicados

export async function createComunicado(req, res) {
  try {
    const comunicadoRepository = AppDataSource.getRepository(Comunicado);
    const { titulo, contenido } = req.body;
    const { error } = createComunicadoValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    // El autor del comunicado es el usuario autenticado (administrador)
    // Se asume que req.user.id está disponible desde el middleware de autenticación
    const autorId = req.user.id; 

    const nuevoComunicado = comunicadoRepository.create({
      titulo,
      contenido,
      autorId,
    });
    await comunicadoRepository.save(nuevoComunicado);

    res.status(201).json({ message: "Comunicado creado exitosamente!", data: nuevoComunicado });
  } catch (error) {
    console.error("Error en comunicado.controller.js -> createComunicado(): ", error);
    return res.status(500).json({ message: "Error al crear el comunicado" });
  }
}

export async function getComunicados(req, res) {
  try {
    const comunicadoRepository = AppDataSource.getRepository(Comunicado);
    const comunicados = await comunicadoRepository.find({
        relations: ['autor'], // Carga la relación con el autor (usuario)
        order: {
            fechaPublicacion: "DESC" // Ordena por fecha de publicación descendente
        }
    });

    res.status(200).json({ message: "Comunicados encontrados: ", data: comunicados });
  } catch (error) {
    console.error("Error en comunicado.controller.js -> getComunicados(): ", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}

export async function getComunicadoById(req, res) {
    try {
        const comunicadoRepository = AppDataSource.getRepository(Comunicado);
        const { id } = req.params;
        console.log("Intentando buscar comunicado con ID:", id);
        const comunicado = await comunicadoRepository.findOne({ 
            where: { id },
            relations: ['autor']
        });

        if (!comunicado) {
            console.log("Comunicado con ID", id, "no encontrado.");
            return res.status(404).json({ message: "Comunicado no encontrado." });
        }
        
        console.log("Comunicado encontrado:", comunicado);
        res.status(200).json({ message: "Comunicado encontrado: ", data: comunicado });
    } catch (error) {
        console.error("Error en comunicado.controller.js -> getComunicadoById(): ", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
}

export async function updateComunicadoById(req, res) {
    try {
        const comunicadoRepository = AppDataSource.getRepository(Comunicado);
        const { id } = req.params;
        const { titulo, contenido } = req.body;
        const comunicado = await comunicadoRepository.findOne({ where: { id } });

        if (!comunicado) {
            return res.status(404).json({ message: "Comunicado no encontrado." });
        }

        // Solo el autor o un administrador pueden actualizar el comunicado
        if (req.user.rol !== "administrador" && req.user.id !== comunicado.autorId) {
            return res.status(403).json({ message: "No tienes permiso para actualizar este comunicado." });
        }

        comunicado.titulo = titulo || comunicado.titulo;
        comunicado.contenido = contenido || comunicado.contenido;

        await comunicadoRepository.save(comunicado);

        res.status(200).json({ message: "Comunicado actualizado exitosamente.", data: comunicado });
    } catch (error) {
        console.error("Error en comunicado.controller.js -> updateComunicadoById(): ", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
}

export async function deleteComunicadoById(req, res) {
    try {
        const comunicadoRepository = AppDataSource.getRepository(Comunicado);
        const { id } = req.params;
        const comunicado = await comunicadoRepository.findOne({ where: { id } });

        if (!comunicado) {
            return res.status(404).json({ message: "Comunicado no encontrado." });
        }

        // Solo el autor o un administrador pueden eliminar el comunicado
        if (req.user.rol !== "administrador" && req.user.id !== comunicado.autorId) {
            return res.status(403).json({ message: "No tienes permiso para eliminar este comunicado." });
        }

        await comunicadoRepository.remove(comunicado);
        res.status(200).json({ message: "Comunicado eliminado exitosamente." });
    } catch (error) {
        console.error("Error en comunicado.controller.js -> deleteComunicadoById(): ", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
}