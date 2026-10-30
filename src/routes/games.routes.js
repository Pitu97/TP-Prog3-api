import { Router } from "express";
import { createGame, deleteGame, findGame, findGames, updateGame } from "../services/games.services.js";

const router = Router();

router.get("/games", findGames);

router.get("/games/:id", findGame);

router.post("/games", createGame);

router.put("/games/:id", updateGame);

router.delete("/games/:id", deleteGame);

export default router;