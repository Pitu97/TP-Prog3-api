import { Router } from "express";
import { createCategory, deleteCategory, findCategories, findCategory, updateCategory } from "../services/categories.services.js";
import { authorizeRoles, verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/categories", findCategories);

router.get("/categories/:id", findCategory);

router.post("/categories", verifyToken, authorizeRoles(1, 2), createCategory);

router.put("/categories/:id", verifyToken, authorizeRoles(1, 2), updateCategory);

router.delete("/categories/:id", verifyToken, authorizeRoles(1, 2), deleteCategory);

export default router;

