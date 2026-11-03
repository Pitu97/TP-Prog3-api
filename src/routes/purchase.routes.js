import { Router } from "express";
import { authorizeRoles, verifyToken } from "../middlewares/auth.middleware.js";
import { createPurchase, getPurchaseHistory } from "../services/purchases.services.js";

const router = Router();

router.post("/purchases", verifyToken, authorizeRoles(3), createPurchase);

router.get("/purchases", verifyToken, authorizeRoles(3), getPurchaseHistory);

export default router;