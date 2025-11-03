import express from "express";
import {
  getBusiness,
  PresignedUrlImageUpload,
  updateBusinessInfomation,
} from "../controllers/business.js";

const router = express.Router();

router.get("/find/:businessid", getBusiness);
router.put("/update", updateBusinessInfomation);
router.get("/profilepic", PresignedUrlImageUpload);

export default router;
