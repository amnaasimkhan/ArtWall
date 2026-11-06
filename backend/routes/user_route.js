import express from "express"
import { getUserInfo, getProfile, deleteAccount, saveShippingAddress } from "../controllers/userController.js";
import { isAdmin, verifyToken } from "../middlewares/roleCheck.js";
const router = express.Router();

router.get("/getUsers",getUserInfo) // isAdmin, verifyToken,
router.get("/profile/:id", getProfile)
// router.put("/updateProfile", verifyToken, updateProfile)
router.delete("/deleteAccount/:id", verifyToken, deleteAccount)
router.post("/addShippingAddress", verifyToken, saveShippingAddress)

export default router;