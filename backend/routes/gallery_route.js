import express from "express"
import { getRooms, getRoomRectangles, createRoomBackground, deleteRoom} from "../controllers/galleryController.js";
import { verifyToken, isAdmin } from "../middlewares/roleCheck.js";

const router = express.Router();

router.get("/get", getRooms)
router.get("/getRectangles/:room_id", getRoomRectangles)
router.post("/create", verifyToken, isAdmin, createRoomBackground)
router.delete("/delete/:id", verifyToken, isAdmin, deleteRoom)

export default router;