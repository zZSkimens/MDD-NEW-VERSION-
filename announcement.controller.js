"use strict";

import { AppDataSource } from "../config/configDb.js";
import { AnnouncementEntity } from "../entity/announcement.entity.js";
import { AnnouncementRecipientEntity } from "../entity/announcementRecipient.entity.js";
import { createAnnouncementValidation } from "../validations/announcement.validation.js";

export async function createAnnouncement(req, res) {
    try {
        const { title, message, targetGroups, attachments, scheduledSendAt } = req.body;
        const adminId = req.user.id;

        // Validar los datos de entrada
        const { error } = createAnnouncementValidation.validate(req.body);
        if (error) return res.status(400).json({ message: error.message });

        const announcementRepository = AppDataSource.getRepository(AnnouncementEntity);
        const userRepository = AppDataSource.getRepository(UserEntity);
        const announcementRecipientRepository = AppDataSource.getRepository(AnnouncementRecipientEntity);

        const newAnnouncement = announcementRepository.create({
            title,
            message,
            targetGroups: JSON.stringify(targetGroups),
            attachments: attachments ? JSON.stringify(attachments) : null,
            scheduledSendAt: scheduledSendAt || null,
            createdBy: { id: adminId },
        });

        await announcementRepository.save(newAnnouncement);

        const recipients = await userRepository
            .createQueryBuilder("user")
            .where("user.role IN (:...targetGroups)", { targetGroups })
            .getMany();

        const recipientEntries = recipients.map(user =>
            announcementRecipientRepository.create({
                announcement: newAnnouncement,
                user: user,
                deliveryMethod: "in-app",
            })
        );
        await announcementRecipientRepository.save(recipientEntries);

        res.status(201).json({
            message: "Comunicado creado y enviado exitosamente a los destinatarios.",
            data: newAnnouncement,
        });
    } catch (error) {
        console.error("Error en announcement.controller.js -> createAnnouncement(): ", error);
        res.status(500).json({ message: "Error al crear el comunicado." });
    }
}

export async function getAnnouncementsForAdmin(req, res) {
    try {
        const announcementRepository = AppDataSource.getRepository(AnnouncementEntity);
        const announcements = await announcementRepository.find({
            relations: ["createdBy"],
        });

        res.status(200).json({
            message: "Comunicados obtenidos exitosamente.",
            data: announcements,
        });
    } catch (error) {
        console.error("Error en announcement.controller.js -> getAnnouncementsForAdmin(): ", error);
        res.status(500).json({ message: "Error al obtener comunicados." });
    }
}

export async function getAnnouncementDetailsForAdmin(req, res) {
    try {
        const { id } = req.params;
        const announcementRepository = AppDataSource.getRepository(AnnouncementEntity);
        const announcementRecipientRepository = AppDataSource.getRepository(AnnouncementRecipientEntity);

        const announcement = await announcementRepository.findOne({
            where: { id: parseInt(id) },
            relations: ["createdBy"],
        });

        if (!announcement) {
            return res.status(404).json({ message: "Comunicado no encontrado." });
        }

        const recipients = await announcementRecipientRepository.find({
            where: { announcement: { id: parseInt(id) } },
            relations: ["user"],
        });

        res.status(200).json({
            message: "Detalles del comunicado obtenidos exitosamente.",
            data: {
                announcement,
                recipients: recipients.map(rec => ({
                    id: rec.id,
                    username: rec.user.username,
                    email: rec.user.email,
                    role: rec.user.role,
                    isRead: rec.isRead,
                    opinion: rec.opinion,
                    sentAt: rec.sentAt,
                    deliveryMethod: rec.deliveryMethod,
                })),
            },
        });
    } catch (error) {
        console.error("Error en announcement.controller.js -> getAnnouncementDetailsForAdmin(): ", error);
        res.status(500).json({ message: "Error al obtener detalles del comunicado." });
    }
}