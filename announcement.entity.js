"use strict";

import { EntitySchema } from "typeorm";

export const AnnouncementEntity = new EntitySchema({
    name: "Announcement",
    tableName: "announcements",
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true,
        },
        title: {
            type: String,
            nullable: false,
        },
        content: {
            type: String,
            nullable: false,
        },
        info: {
            type: String,
            nullable: true,
        },
        attachments: {
            type: String, 
            nullable: true,
        },
        scheduledSendAt: {
            type: "timestamp",
            nullable: true,
        },
        createdAt: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
        },
        updatedAt: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
            onUpdate: () => "CURRENT_TIMESTAMP",
        },
    },
relations: {
        createdBy: {
            type: "many-to-one",
            target: "User",
            joinColumn: { name: "createdById" },
            cascade: false,
        },
    },
});

export default AnnouncementEntity;