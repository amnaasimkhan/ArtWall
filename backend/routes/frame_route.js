import express from "express"
import { getFrames, createFrame, updateFrame, deleteFrame } from "../controllers/frameController.js";
import { verifyToken, isAdmin } from "../middlewares/roleCheck.js";
const router = express.Router();

router.get("/get", getFrames)
router.post("/create", verifyToken, isAdmin, createFrame)
router.put("/update", verifyToken, isAdmin, updateFrame)
router.delete("/delete/:id", verifyToken, isAdmin, deleteFrame)

export default router;