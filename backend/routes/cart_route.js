import express from "express"
import { addToCart, updateItemQuantity, fetchCart } from "../controllers/cartController.js";
import { verifyToken } from "../middlewares/roleCheck.js";

const router = express.Router();

router.post("/addToCart",verifyToken, addToCart)   
router.put("/updateItemQuantity",verifyToken, updateItemQuantity)
router.get("/fetchCart", verifyToken,fetchCart)    



export default router;