import { Router } from "express";

const router = Router();

router.get("/games", (req, res) => {
    res.send("Obteniendo Juegos")
});

router.get("/games/:id", (req, res) => {
    const { id } = req.params;
    res.send(`Obteniendo juego con id: ${id}`);
});

export default router;