import { Router } from "express";
import { Videojuego } from "../models/Videojuego.js";

const router = Router();

router.get("/games", async (req, res) => {
    const games = await Videojuego.findAll();
    res.json(games);
});

router.get("/games/:id", async (req, res) => {
    const { id } = req.params;
    const game = await Videojuego.findByPk(id);

    if (!game) {
        return res.status(404).json({ message: "Game not found" });
    }
    
    res.json(game);
});

router.post("/games", async (req, res) => {
    const { nombre, descripcion, precio, plataforma, imagenUrl, categoriaId } = req.body;

    if (!nombre || !plataforma) {
        return res.status(400).json({ message: "Nombre and plataforma fields are required" });
    }

    const newGame = await Videojuego.create({
        nombre,
        descripcion,
        precio,
        plataforma,
        imagenUrl,
        categoriaId
    })
    res.json(newGame);
});

router.put("/games/:id", async (req, res) => {
    const { nombre, descripcion, precio, plataforma, imagenUrl, categoriaId } = req.body;
    const { id } = req.params;

    const game = await Videojuego.findByPk(id);

    await game.update({
        nombre,
        descripcion,
        precio,
        plataforma,
        imagenUrl,
        categoriaId
    })

    await game.save();

    res.json(game);
});

router.delete("/games/:id", async (req, res) => {
    const { id } = req.params;

    const game = await Videojuego.findByPk(id);

    await game.destroy();

    res.send(`Juego con id: ${id} borrado`);
});

export default router;