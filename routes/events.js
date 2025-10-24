import express from "express";
import {
  getNear,
  getFollowing,
  getUserEvents,
  deleteEvent,
  addEvent,
  addInteraction,
  addView,
} from "../controllers/events.js";
const router = express.Router();

router.get("/near", getNear);
router.get("/following", getFollowing);
router.get("/:userid", getUserEvents);
router.delete("/delete", deleteEvent);
router.post("/update", addInteraction);
router.post("/update/view", addView);
router.post("/", addEvent);
export default router;
