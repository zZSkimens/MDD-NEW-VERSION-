"use strict";

import { EntitySchema } from "typeorm";

export const ReservationEntity = new EntitySchema({
    name: "Reservation",
    tableName: "reservations",
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true,
        },
        startDate: {
            type: Date,
            nullable: false,
        },
        endDate: {
            type: Date,
            nullable: false,
        },
        status: {
            type: String,
            default: "pending", 
            nullable: false,
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
        user: {
            type: "many-to-one",
            target: "User",
            joinColumn: true,
            cascade: true,
            onDelete: "CASCADE",
        },
        commonArea: {
            type: "many-to-one",
            target: "CommonArea",
            joinColumn: true,
            cascade: true,
            onDelete: "CASCADE",
        },
    },
});

export default ReservationEntity;