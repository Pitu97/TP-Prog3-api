import { Router } from "express";
import { authorizeRoles, verifyToken } from "../middlewares/auth.middleware.js";
import { createPurchase } from "../services/purchases.services.js";

const router = Router();

router.post("/purchases", verifyToken, authorizeRoles(3), createPurchase);

export default router;