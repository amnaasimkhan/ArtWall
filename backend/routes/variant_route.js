import express from "express"
import { getVariantsByArtwork,getVariantsBySize, createVariant, updateVariant, deleteVariant} from "../controllers/variantController.js";
import {isAdmin, verifyToken} from "../middlewares/roleCheck.js"
const router = express.Router();


router.get("/getByArtwork/:id", getVariantsByArtwork)
router.get("/getBySize/:id", getVariantsBySize)
router.post("/create", verifyToken, isAdmin, createVariant)
router.put("/update",verifyToken, isAdmin, updateVariant)
router.delete("/delete",verifyToken, isAdmin, deleteVariant)

export default router;