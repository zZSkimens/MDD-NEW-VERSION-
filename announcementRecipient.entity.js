"use strict";

import { EntitySchema } from "typeorm";

export const AnnouncementRecipientEntity = new EntitySchema({
    name: "AnnouncementRecipient",
    tableName: "announcement_recipients",
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        sentAt: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
        },
        deliveryMethod: {
            type: String,
            nullable: true,
        },
        opinion: {
            type: String,
            nullable: true,
        },
    },
    relations: {
        announcement: {
            type: "many-to-one",
            target: "Announcement", 
            joinColumn: { name: "announcementId" },
            onDelete: "CASCADE",
        },
        user: {
            type: "many-to-one",
            target: "User",
            joinColumn: { name: "userId" },
            onDelete: "CASCADE",
        },
    },
});

export default AnnouncementRecipientEntity;