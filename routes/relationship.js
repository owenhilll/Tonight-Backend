import express from "express";
import {
  deleteRelationship,
  postRelationship,
  getFollowers,
} from "../controllers/relationship.js";

const router = express.Router();

router.get("/", getFollowers);
router.post("/", postRelationship);
router.delete("/", deleteRelationship);

export default router;
