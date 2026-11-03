import { Router } from "express";
import { authorizeRoles, verifyToken } from "../middlewares/auth.middleware.js";
import { createPurchase, getAllPurchases, getPurchaseHistory } from "../services/purchases.services.js";

const router = Router();

router.post("/purchases", verifyToken, authorizeRoles(3), createPurchase);

router.get("/purchases", verifyToken, authorizeRoles(3), getPurchaseHistory);

router.get("/admin/purchases", verifyToken, authorizeRoles(1, 2), getAllPurchases);

export default router;