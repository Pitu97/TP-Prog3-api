import express from 'express';
import { PORT } from './config.js';
import gameRoutes from "./routes/games.routes.js";
import { sequelize } from './db.js';
import { Categoria } from './models/Categoria.js';
import { Videojuego } from './models/Videojuego.js';

const app = express();

Categoria.hasMany(Videojuego, {
    foreignKey: 'categoriaId',
    onDelete: 'RESTRICT'
});

Videojuego.belongsTo(Categoria, {
    foreignKey: 'categoriaId',
    allowNull: false
});

async function iniciarServidor() {
    try {
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



