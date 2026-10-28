import express from 'express';
import { PORT } from './config.js';
import gameRoutes from "./routes/games.routes.js";
import { sequelize } from './db.js';
import { Categoria } from './models/Categoria.js';
import { Videojuego } from './models/Videojuego.js';
import { Rol } from './models/Rol.js';
import { Usuario } from './models/Usuario.js';
import { Compra } from './models/Compra.js';
import { DetalleCompra } from './models/DetalleCompra.js';

const app = express();

Categoria.hasMany(Videojuego, {
    foreignKey: 'categoriaId',
    onDelete: 'RESTRICT'
});

Videojuego.belongsTo(Categoria, {
    foreignKey: 'categoriaId',
    allowNull: false
});

Rol.hasMany(Usuario, {
    foreignKey: 'rolId',
    onDelete: 'RESTRICT'
});

Usuario.belongsTo(Rol, {
    foreignKey: 'rolId',
    allowNull: false
});

Usuario.hasMany(Compra, {
    foreignKey: 'usuarioId',
    onDelete: 'RESTRICT'
});

Compra.belongsTo(Usuario, {
    foreignKey: 'usuarioId',
    allowNull: false
});

Compra.hasMany(DetalleCompra, {
    foreignKey: 'compraId',
    onDelete: 'RESTRICT'
});

DetalleCompra.belongsTo(Compra, {
    foreignKey: 'compraId',
    allowNull: false
});

Videojuego.hasMany(DetalleCompra, {
    foreignKey: 'videojuegoId',
    onDelete: 'RESTRICT'
});

DetalleCompra.belongsTo(Videojuego, {
    foreignKey: 'videojuegoId',
    allowNull: false
});

async function iniciarServidor() {
    try {
        app.use(express.json());
        await sequelize.sync();
        console.log('Base de datos sincronizada');


        app.listen(PORT, () => {
            app.use(gameRoutes);
            console.log(`Servidor escuchando en el puerto: ${PORT}`);
        });
    
    } catch (error) {
    console.log('Hubo un error en la inicializacion:', error);
    }
}

iniciarServidor();



