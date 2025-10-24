import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getComments = (req, res) => {
  const q = `SELECT c.*, u.id AS userid, name, profilepic FROM comments AS c 
            JOIN users AS u ON (u.id = c.userid) WHERE c.postid = ? ORDER BY c.createdat DESC`;

  db.query(q, [req.query.postid], (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data);
  });
};

export const postComment = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in");

  jwt.verify(token, "secretkey", (err, userinfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q =
      "INSERT INTO comments (`desc`, `postid`,`userid`,`createdat`) VALUES (?)";

    const values = [
      req.body.desc,
      req.query.postid,
      userinfo.id,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Comment has been created!");
    });
  });
};
