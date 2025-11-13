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
  getPopular,
  getNearest,
  getPromoted,
  getProximity,
  promoteEvent,
  getPromotedById,
} from "../controllers/events.js";
const router = express.Router();

router.get("/near", getNear);
router.post("/promote", promoteEvent);
router.get("/popular", getPopular);
router.get("/promoted/:eventid", getPromotedById);
router.get("/nearest", getNearest);
router.get("/promoted", getPromoted);
router.get("/proximity", getProximity);
router.get("/get", getEventsById);
router.get("/following", getFollowing);
router.get("/:userid", getEventsFromBusiness);
router.delete("/delete", deleteEvent);
router.post("/update", addInteraction);
router.put("/update/view", addView);
router.put("/update", updateEvent);
router.post("/", addEvent);
export default router;
