import express from "express"
import {createArtist, getArtists, getArtistById,updateArtist,deleteArtist } from "../controllers/artistController.js"
import {getFeaturedArtists, getFeaturedArtistDetail} from "../controllers/featuredController.js"
import { verifyToken, isAdmin } from "../middlewares/roleCheck.js";

const router = express.Router();

router.post("/createArtist",verifyToken, isAdmin, createArtist)
router.delete("/deleteArtist/:id", verifyToken, isAdmin,deleteArtist)
router.put("/updateArtist/:id", verifyToken, isAdmin, updateArtist )
router.get("/getArtistById/:id", verifyToken, isAdmin, getArtistById) //use product id as paramter in url
router.get("/getArtists",getArtists )
router.get("/getFeaturedArtists", getFeaturedArtists )
router.get("/getFeaturedArtist/:id",getFeaturedArtistDetail)

export default router;