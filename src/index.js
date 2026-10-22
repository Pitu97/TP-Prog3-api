import express from 'express';
import { PORT } from './config.js';
import gameRoutes from "../routes/games.routes.js";

const app = express();

app.listen(PORT);
app.use(gameRoutes);
console.log(`Server listening on port ${PORT}`)