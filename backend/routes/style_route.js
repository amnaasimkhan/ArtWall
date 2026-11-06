import express from "express"
import { verifyToken, isAdmin } from "../middlewares/roleCheck.js";
import { getStyles, deleteStyle, createStyle, filterByStyle } from "../controllers/styleController.js";
const router = express.Router();

router.post("/createStyle", verifyToken, isAdmin, createStyle)
router.get("/getStyles", getStyles)
router.delete("/deleteStyle",verifyToken, isAdmin,deleteStyle)
router.get("/filterbyStyle/:id",filterByStyle)

export default router;