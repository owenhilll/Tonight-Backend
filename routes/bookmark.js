import express from "express";
import {
  CreateBookmark,
  DeleteBookmark,
  GetBookmarks,
} from "../controllers/bookmarks.js";

const router = express.Router();

router.post("/add", CreateBookmark);
router.delete("/delete", DeleteBookmark);
router.get("/get", GetBookmarks);

export default router;
