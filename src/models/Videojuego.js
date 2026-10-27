import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const Videojuego = sequelize.define('videojuego', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    plataforma: {
        type: DataTypes.STRING,
        allowNull: false
    },
    imagenUrl: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: false
});