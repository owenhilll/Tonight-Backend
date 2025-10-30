import express from "express";
import {
  getNear,
  getFollowing,
  deleteEvent,
  addEvent,
  addInteraction,
  addView,
  getEventsFromBusiness,
  updateEvent,
  getEventsById,
} from "../controllers/events.js";
const router = express.Router();

router.get("/near", getNear);
router.get("/get", getEventsById);
router.get("/following", getFollowing);
router.get("/:userid", getEventsFromBusiness);
router.delete("/delete", deleteEvent);
router.post("/update", addInteraction);
router.put("/update/view", addView);
router.put("/update", updateEvent);
router.post("/", addEvent);
export default router;
