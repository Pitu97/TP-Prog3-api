import { Router } from "express";
import { createCategory, deleteCategory, findCategories, findCategory, updateCategory } from "../services/categories.services.js";

const router = Router();

router.get("/categories", findCategories);

router.get("/categories/:id", findCategory);

router.post("/categories", createCategory);

router.put("/categories/:id", updateCategory);

router.delete("/categories/:id", deleteCategory);

export default router;

