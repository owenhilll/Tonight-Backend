import Express from "express";
import * as dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import relationshipRoutes from "./routes/relationship.js";
import placeRoutes from "./routes/business.js";
import commentsRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import bookmarkRoutes from "./routes/bookmark.js";
import eventRoutes from "./routes/events.js";
import cookieParser from "cookie-parser";
import https from "https";
import cors from "cors";
import "./utils/scheduledTasks.js";
import { Client } from "@googlemaps/google-maps-services-js";
import fs from "fs";

dotenv.config();
const app = Express();

//middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(
  cors({
    origin: "http://localhost:8081",
  })
);

var options = {
  key: fs.readFileSync("localhost.key"),
  cert: fs.readFileSync("localhost.crt"),
};

app.use(cookieParser());
app.use(Express.json({ limit: "50mb" }));
app.use(Express.urlencoded({ limit: "50mb" }));
app.use("/api/businesses", placeRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/relationship", relationshipRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
//t
app.listen(8000, () => {
  console.log("API working");
});
