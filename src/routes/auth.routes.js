import { Router } from "express";
import { createAdmin, loginUser, registerUser } from "../services/auth.services.js";
import { authorizeRoles, verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/users/register", registerUser);

router.post("/users/login", loginUser);

router.post("/users/admin", verifyToken, authorizeRoles(1), createAdmin);

export default router;