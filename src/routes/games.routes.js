import { Router } from "express";
import { createGame, deleteGame, findGame, findGames, updateGame } from "../services/games.services.js";
import { authorizeRoles, verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/games", findGames);

router.get("/games/:id", findGame);

router.post("/games", verifyToken, authorizeRoles(1, 2), createGame);

router.put("/games/:id", verifyToken, authorizeRoles(1, 2), updateGame);

router.delete("/games/:id", verifyToken, authorizeRoles(1, 2), deleteGame);

export default router;