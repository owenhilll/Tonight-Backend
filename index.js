import Express from "express";

const app = Express();
import authRoutes from "./routes/auth.js";
import relationshipRoutes from "./routes/relationship.js";
import placeRoutes from "./routes/business.js";
import commentsRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import eventRoutes from "./routes/events.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import Geocoder from "react-native-geocoding";

Geocoder.init("AIzaSyCdlWWT4orEFXd1APChCUCuAPNa9kuOihE");

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
app.use(cookieParser());
app.use(Express.json({ limit: "50mb" }));
app.use(Express.urlencoded({ limit: "50mb" }));
app.use("/api/businesses", placeRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/relationship", relationshipRoutes);
app.use("/api/events", eventRoutes);

app.listen(8800, () => {
  console.log("API working");
});
