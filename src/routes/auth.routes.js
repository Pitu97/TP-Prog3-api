import { Router } from "express";
import { createAdmin, deleteUser, getAllUsers, getUserbyId, loginUser, registerUser, updateUser } from "../services/auth.services.js";
import { authorizeRoles, verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/users/register", registerUser);

router.post("/users/login", loginUser);

router.post("/users/admin", verifyToken, authorizeRoles(1), createAdmin);

router.get("/admin/users", verifyToken, authorizeRoles(1, 2), getAllUsers);

router.get("/admin/users/:id", verifyToken, authorizeRoles(1, 2), getUserbyId);

router.patch("/admin/users/:id", verifyToken, authorizeRoles(1, 2), updateUser);

router.delete("/admin/users/:id", verifyToken, authorizeRoles(1, 2), deleteUser);

export default router;