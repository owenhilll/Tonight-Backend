import express from "express";
import {
  getBusiness,
  PresignedUrlImageUpload,
  setBusinessWebsite,
} from "../controllers/business.js";

const router = express.Router();

router.get("/find/:businessid", getBusiness);
router.put("/website", setBusinessWebsite);
router.get("/profilepic", PresignedUrlImageUpload);

export default router;
