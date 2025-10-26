import express from "express";
import {
  getBusiness,
  PresignedUrlImageUpload,
  setBusiness,
} from "../controllers/business.js";

const router = express.Router();

router.get("/find/:businessid", getBusiness);
router.post("/", setBusiness);
router.get("/edit/profilepic", PresignedUrlImageUpload);

export default router;
