import { Router } from "express";

const router = Router();

router.get("/games", (req, res) => {
    res.send("Obteniendo Juegos")
});

export default router;