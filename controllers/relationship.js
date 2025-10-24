import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getFollowers = (req, res) => {
  const q = "SELECT * FROM relationships WHERE followeduserid = ?";

  db.query(q, [req.query.id], (err, data) => {
    if (err) return res.status(500).json(err);
    return res
      .status(200)
      .json(data.map((relationship) => relationship.followeruserid));
  });
};

export const postRelationship = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in");

  jwt.verify(token, "secretkey", (err, userinfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q =
      "INSERT INTO relationships (`followeruserid`, `followeduserid`) VALUES (?)";

    const values = [userinfo.id, parseInt(req.query.id)];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("User has been followed!");
    });
  });
};
export const deleteRelationship = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in");

  jwt.verify(token, "secretkey", (err, userinfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q =
      "DELETE FROM relationships WHERE `followeruserid` = ? AND `followeduserid` = ?";

    db.query(q, [userinfo.id, req.query.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("User has been followed!");
    });
  });
};
