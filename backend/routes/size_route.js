import express from "express"
import {getSizes} from '../controllers/sizeController.js'
import { verifyToken, isAdmin } from "../middlewares/roleCheck.js";
const router = express.Router();

router.get("/get", getSizes)

export default router;