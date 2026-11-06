import express from "express"
import { verifyToken, isAdmin } from "../middlewares/roleCheck.js";
import { getAdminDashboard } from "../controllers/adminController.js";
import { getVariantStats, getBestPerformingArtists, getBestsellingArtworks, getBestsellingStyles, getOrdersPerMonth, getRevenueStats } from "../controllers/analyticsController.js";
const router = express.Router();

router.get("/dashboard", getAdminDashboard)
router.get("/bestArtists", getBestPerformingArtists)
router.get("/bestArtworks", getBestsellingArtworks)
router.get("/variantStats", getVariantStats)
router.get("/bestStyles", getBestsellingStyles)
router.get("/orderPerMonth", getOrdersPerMonth)
router.get("/revenueStats", getRevenueStats)

export default router;