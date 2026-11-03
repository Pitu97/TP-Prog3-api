import { Router } from "express";
import { authorizeRoles, verifyToken } from "../middlewares/auth.middleware.js";
import { createPurchase, getAllPurchases, getPurchaseHistory, updatePurchaseStatus } from "../services/purchases.services.js";

const router = Router();

router.post("/purchases", verifyToken, authorizeRoles(3), createPurchase);

router.get("/purchases", verifyToken, authorizeRoles(3), getPurchaseHistory);

router.get("/admin/purchases", verifyToken, authorizeRoles(1, 2), getAllPurchases);

router.patch("/admin/purchases/:id/status", verifyToken, authorizeRoles(1, 2), updatePurchaseStatus);

export default router;