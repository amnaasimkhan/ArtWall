import express from "express"
import { checkout, updateOrderStatus, getOrderById, getOrders } from "../controllers/orderController.js";
import { verifyToken, isAdmin } from "../middlewares/roleCheck.js";
const router = express.Router();

router.post("/checkout", verifyToken, checkout)
router.put("/updateOrderStatus/:id", verifyToken,isAdmin, updateOrderStatus)
router.get("/getOrderById",verifyToken, isAdmin, getOrderById)
router.get("/get",  getOrders)     


export default router;