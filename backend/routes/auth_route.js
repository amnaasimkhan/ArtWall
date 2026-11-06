import express from "express"
import { login,  register} from "../controllers/auth.js";
import { validateLogin, validateRegister } from "../middlewares/validateRequest.js";

const router = express.Router();

router.post("/register", validateRegister, register)
router.post("/login", validateLogin, login)

export default router;