import { Router } from "express";

const router = Router();

router.get("/games", (req, res) => {
    res.send("Obteniendo Juegos")
});

router.get("/games/:id", (req, res) => {
    const { id } = req.params;
    res.send(`Obteniendo juego con id: ${id}`);
});

router.post("/games", (req, res) => {
    res.send("Creando Juego")
});

router.put("/games/:id", (req, res) => {
    const { id } = req.params;
    res.send(`Actualizando juego con id: ${id}`);
});

router.delete("/games/:id", (req, res) => {
    const { id } = req.params;
    res.send(`Borrando juego con id: ${id}`);
});

export default router;