import express from 'express';
import { PORT } from './config.js';
import gameRoutes from "./routes/games.routes.js";
import categoryRoutes from "./routes/categories.routes.js";
import { sequelize } from './db.js';
import { Categoria } from './models/Categoria.js';
import { Videojuego } from './models/Videojuego.js';
import { Rol } from './models/Rol.js';
import { Usuario } from './models/Usuario.js';
import { Compra } from './models/Compra.js';
import { DetalleCompra } from './models/DetalleCompra.js';

const app = express();

// CATEGORIA - VIDEOJUEGO

Categoria.hasMany(Videojuego, {
    foreignKey: {
        name: 'categoryId',
        allowNull: false
    },
    onDelete: 'RESTRICT'
});

Videojuego.belongsTo(Categoria, {
    foreignKey: {
        name: 'categoryId',
        allowNull: false
    }
});

// ROL - USUARIO

Rol.hasMany(Usuario, {
    foreignKey: {
        name: 'roleId',
        allowNull: false
    },
    onDelete: 'RESTRICT'
});

Usuario.belongsTo(Rol, {
    foreignKey: {
        name: 'roleId',
        allowNull: false
    }
});

// USUARIO - COMPRA

Usuario.hasMany(Compra, {
    foreignKey: {
        name: 'userId',
        allowNull: false
    },
    onDelete: 'RESTRICT'
});

Compra.belongsTo(Usuario, {
    foreignKey: {
        name: 'userId',
        allowNull: false
    }
});

// COMPRA - DETALLECOMPRA

Compra.hasMany(DetalleCompra, {
    foreignKey: {
        name:'purchaseId',
        allowNull: false
    },
    onDelete: 'RESTRICT'
});

DetalleCompra.belongsTo(Compra, {
    foreignKey: {
        name:'purchaseId',
        allowNull: false
    }
});

// VIDEOJUEGO - DETALLECOMPRA

Videojuego.hasMany(DetalleCompra, {
    foreignKey: {
        name:'gameId',
        allowNull: false
    },
    onDelete: 'RESTRICT'
});

DetalleCompra.belongsTo(Videojuego, {
    foreignKey: {
        name:'gameId',
        allowNull: false
    }
});

// INICIO DEL SERVER

async function iniciarServidor() {
    try {
        app.use(express.json());
        await sequelize.sync();
        console.log('Base de datos sincronizada');

        app.use(gameRoutes);
        app.use(categoryRoutes);
        
        app.listen(PORT, () => {
            console.log(`Servidor escuchando en el puerto: ${PORT}`);
        });
    
    } catch (error) {
    console.log('Hubo un error en la inicializacion:', error);
    }
}

iniciarServidor();



