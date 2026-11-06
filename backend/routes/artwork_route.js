import express from "express"
import { createArtwork , updateArtwork, deleteArtwork, getArtworkById , getArtworks, getBestsellers} from "../controllers/artworkController.js";
import { verifyToken, isAdmin } from "../middlewares/roleCheck.js";
import { validateCreateArtwork, validateUpdateArtwork } from "../middlewares/validateArtwork.js";

const router = express.Router();

router.post("/admin/createArtwork", verifyToken,isAdmin, createArtwork)
router.delete("/admin/deleteArtwork/:id",verifyToken, isAdmin, deleteArtwork)
router.put("/admin/updateArtwork/:id",verifyToken, isAdmin, updateArtwork)
router.get("/getArtworkById/:id", getArtworkById) //use product id as paramter in url
router.get("/getArtworks", getArtworks)
router.get("/getBestsellers", getBestsellers)

export default router;