import moment from "moment";
import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getNear = (req, res) => {
  var coords = req.query;
  if (req.query.category != "") {
    const q = `SELECT events.* FROM events 
    LEFT JOIN businesses ON 
    (ST_DISTANCE_SPHERE(point(ST_X(coordinates), ST_Y(coordinates)), point(${coords.x},${coords.y})) * .000621371192) <= 1 
    where events.businessid = businesses.id AND events.category = '${req.query.category}'`;

    db.query(q, [req.query.category], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  } else {
    const q = `SELECT events.* FROM events 
    LEFT JOIN businesses ON 
    (ST_DISTANCE_SPHERE(point(ST_X(coordinates), ST_Y(coordinates)), point(${coords.x},${coords.y})) * .000621371192) <= 1 
    where events.businessid = businesses.id`;

    db.query(q, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  }
};

export const getFollowing = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in");

  jwt.verify(token, "secretkey", (err, userinfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q =
      "SELECT * FROM events e INNER JOIN relationships r ON (r.followeduserid = e.businessid) WHERE r.followinguserid = ?";

    db.query(q, [userinfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const getUserEvents = (req, res) => {
  var id = req.params.userid;
  const q = "SELECT * FROM events WHERE businessid = ?";
  db.query(q, [id], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const deleteEvent = (req, res) => {
  var id = req.query.eventid;
  const q = "DELETE FROM events WHERE id = ?";
  db.query(q, [id], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const addInteraction = (req, res) => {
  var id = req.query.eventid;
  const q = "UPDATE events SET interactions = interactions + 1 WHERE id = ?";
  db.query(q, [id], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const addView = (req, res) => {
  var id = req.query.eventid;
  const q = "UPDATE events SET views = views + 1 WHERE id = ?";
  db.query(q, [id], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const addEvent = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in");

  jwt.verify(token, "secretkey", (err, userinfo) => {
    if (err) return res.status(403).json("Token is not valid");
    const q =
      "INSERT INTO events (`desc`, `category`, `title`,`posteddate`,`businessid`) VALUES (?)";

    const values = [
      req.body.desc,
      req.body.category,
      req.body.title,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userinfo.id,
    ];
    db.query(q, [values], (err, data) => {
      console.log(err);
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been created!");
    });
  });
};
