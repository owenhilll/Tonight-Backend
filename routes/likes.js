import express from "express";
import { getLikes, postLike, deleteLike } from "../controllers/like.js";

const router = express.Router();

router.get("/", getLikes);
router.post("/", postLike);
router.delete("/", deleteLike);
export default router;
