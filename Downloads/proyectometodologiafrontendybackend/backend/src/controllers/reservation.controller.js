"use strict";
import Reserva from "../entity/reservation.entity.js";
import AreaComun from "../entity/commonArea.entity.js";
import Usuario from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { LessThanOrEqual, MoreThanOrEqual } from "typeorm";

export async function obtenerReservas(req, res) {
  try {
    const repositorioReserva = AppDataSource.getRepository(Reserva);
    const reservas = await repositorioReserva.find({
      relations: ["user", "commonArea"],
    });
    res
      .status(200)
      .json({ mensaje: "Reservas encontradas: ", datos: reservas });
  } catch (error) {
    console.error(
      "Error en reservation.controller.js -> obtenerReservas(): ",
      error
    );
    res.status(500).json({ mensaje: "Error interno del servidor." });
  }
}

export async function obtenerReservaPorId(req, res) {
  try {
    const repositorioReserva = AppDataSource.getRepository(Reserva);
    const { id } = req.params;
    const reserva = await repositorioReserva.findOne({
      where: { id },
      relations: ["user", "commonArea"],
    });

    if (!reserva) {
      return res.status(404).json({ mensaje: "Reserva no encontrada." });
    }
    res.status(200).json({ mensaje: "Reserva encontrada: ", datos: reserva });
  } catch (error) {
    console.error(
      "Error en reservation.controller.js -> obtenerReservaPorId(): ",
      error
    );
    res.status(500).json({ mensaje: "Error interno del servidor." });
  }
}

export async function obtenerReservasUsuario(req, res) {
  try {
    const repositorioReserva = AppDataSource.getRepository(Reserva);
    const repositorioUsuario = AppDataSource.getRepository(Usuario);
    const emailUsuario = req.user.email;

    const usuario = await repositorioUsuario.findOne({
      where: { email: emailUsuario },
    });
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado." });
    }

    const reservas = await repositorioReserva.find({
      where: { user: { id: usuario.id } },
      relations: ["commonArea"],
      order: { startDate: "ASC" },
    });
    res.status(200).json({ mensaje: "Tus reservas: ", datos: reservas });
  } catch (error) {
    console.error(
      "Error en reservation.controller.js -> obtenerReservasUsuario(): ",
      error
    );
    res.status(500).json({ mensaje: "Error interno del servidor." });
  }
}

export async function obtenerAreasComunesDisponibles(req, res) {
  try {
    const repositorioAreaComun = AppDataSource.getRepository(AreaComun);
    const repositorioReserva = AppDataSource.getRepository(Reserva);
    const { fechaInicio, fechaFin } = req.query;

    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({
        mensaje:
          "Se requieren las fechas de inicio y fin para verificar la disponibilidad.",
      });
    }

    const fechaInicioConsulta = new Date(fechaInicio);
    const fechaFinConsulta = new Date(fechaFin);

    const todasLasAreasComunes = await repositorioAreaComun.find();
    const areasDisponibles = [];
    const areasNoDisponibles = [];

    for (const area of todasLasAreasComunes) {
      const reservasEnConflicto = await repositorioReserva.find({
        where: {
          commonArea: { id: area.id },
          status: "approved",
          startDate: LessThanOrEqual(fechaFinConsulta),
          endDate: MoreThanOrEqual(fechaInicioConsulta),
        },
      });

      if (reservasEnConflicto.length === 0) {
        areasDisponibles.push(area);
      } else {
        areasNoDisponibles.push(area);
      }
    }
    res.status(200).json({
      mensaje: "Áreas comunes disponibles y no disponibles para el período:",
      disponibles: areasDisponibles,
      noDisponibles: areasNoDisponibles,
    });
  } catch (error) {
    console.error(
      "Error en reservation.controller.js -> obtenerAreasComunesDisponibles(): ",
      error
    );
    res.status(500).json({ mensaje: "Error interno del servidor." });
  }
}

export async function crearReserva(req, res) {
  try {
    const repositorioReserva = AppDataSource.getRepository(Reserva);
    const repositorioAreaComun = AppDataSource.getRepository(AreaComun);
    const repositorioUsuario = AppDataSource.getRepository(Usuario);

    const { idAreaComun, fechaInicio, fechaFin } = req.body;
    const emailUsuario = req.user.email;

    const usuario = await repositorioUsuario.findOne({
      where: { email: emailUsuario },
    });
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado." });
    }

    const areaComun = await repositorioAreaComun.findOne({
      where: { id: idAreaComun },
    });
    if (!areaComun) {
      return res.status(404).json({ mensaje: "Área común no encontrada." });
    }

    function parseDateString(str) {
      if (!str) return null;
      const [year, month, day] = str.split("-").map(Number);
      return new Date(year, month - 1, day);
    }
    const nuevaFechaInicio = parseDateString(fechaInicio);
    const nuevaFechaFin = parseDateString(fechaFin);

    if (nuevaFechaInicio >= nuevaFechaFin) {
      return res.status(400).json({
        mensaje: "La fecha de inicio debe ser anterior a la fecha de fin.",
      });
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    if (nuevaFechaInicio < hoy) {
      return res
        .status(400)
        .json({ mensaje: "La fecha de inicio no puede ser en el pasado." });
    }

    // Verificar si el usuario ya tiene una reserva pendiente para esta área y rango de fechas
    const reservaPendiente = await repositorioReserva.findOne({
      where: {
        user: { id: usuario.id },
        commonArea: { id: areaComun.id },
        status: "pending",
        startDate: LessThanOrEqual(nuevaFechaFin),
        endDate: MoreThanOrEqual(nuevaFechaInicio),
      },
    });
    if (reservaPendiente) {
      return res.status(409).json({
        mensaje:
          "Ya tienes una solicitud pendiente para esta área y rango de fechas. Espera la respuesta antes de volver a reservar.",
      });
    }

    const reservasEnConflicto = await repositorioReserva.find({
      where: {
        commonArea: { id: areaComun.id },
        status: "approved",
        startDate: LessThanOrEqual(nuevaFechaFin),
        endDate: MoreThanOrEqual(nuevaFechaInicio),
      },
    });

    if (reservasEnConflicto.length > 0) {
      return res.status(409).json({
        mensaje:
          "El área común ya está reservada para el período seleccionado.",
      });
    }

    const nuevaReserva = repositorioReserva.create({
      user: usuario,
      commonArea: areaComun,
      startDate: nuevaFechaInicio,
      endDate: nuevaFechaFin,
      status: "pending",
    });
    await repositorioReserva.save(nuevaReserva);

    res.status(201).json({
      mensaje: "Reserva creada exitosamente! (Pendiente de aprobación)",
      datos: nuevaReserva,
    });
  } catch (error) {
    console.error(
      "Error en reservation.controller.js -> crearReserva(): ",
      error
    );
    res.status(500).json({ mensaje: "Error al crear la reserva." });
  }
}

export async function actualizarEstadoReserva(req, res) {
  try {
    const repositorioReserva = AppDataSource.getRepository(Reserva);
    const { id } = req.params;
    const { estado } = req.body;

    if (!["approved", "rejected", "completed"].includes(estado)) {
      return res.status(400).json({
        mensaje:
          "Estado de reserva inválido. Los estados permitidos son 'approved', 'rejected' o 'completed'.",
      });
    }

    const reserva = await repositorioReserva.findOne({
      where: { id },
      relations: ["commonArea"],
    });
    if (!reserva) {
      return res.status(404).json({ mensaje: "Reserva no encontrada." });
    }

    reserva.status = estado;
    await repositorioReserva.save(reserva);

    // Actualizar el área común según el estado de la reserva
    const area = await AppDataSource.getRepository(AreaComun).findOne({
      where: { id: reserva.commonArea.id },
    });
    if (area) {
      if (estado === "approved") {
        area.status = "No disponible";
        area.startDate = reserva.startDate;
        area.endDate = reserva.endDate;
      } else if (estado === "completed" || estado === "rejected") {
        area.status = "Disponible";
        area.startDate = null;
        area.endDate = null;
      }
      await AppDataSource.getRepository(AreaComun).save(area);
    }

    res
      .status(200)
      .json({ mensaje: "Estado de la reserva actualizado.", datos: reserva });
  } catch (error) {
    console.error(
      "Error en reservation.controller.js -> actualizarEstadoReserva(): ",
      error
    );
    res.status(500).json({ mensaje: "Error interno del servidor." });
  }
}

export async function eliminarReservaPorId(req, res) {
  try {
    const repositorioReserva = AppDataSource.getRepository(Reserva);
    const { id } = req.params;
    const reserva = await repositorioReserva.findOne({ where: { id } });

    if (!reserva) {
      return res.status(404).json({ mensaje: "Reserva no encontrada." });
    }

    await repositorioReserva.remove(reserva);
    res.status(200).json({ mensaje: "Reserva eliminada exitosamente." });
  } catch (error) {
    console.error(
      "Error en reservation.controller.js -> eliminarReservaPorId(): ",
      error
    );
    res.status(500).json({ mensaje: "Error interno del servidor." });
  }
}
