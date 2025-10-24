import express from "express";
import {
  getBusiness,
  setBusiness,
  setProfilePic,
} from "../controllers/business.js";

const router = express.Router();

router.get("/find/:businessid", getBusiness);
router.post("/", setBusiness);
router.post("/edit/profilepic", setProfilePic);

export default router;
