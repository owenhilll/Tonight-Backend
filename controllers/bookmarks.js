import jwt from "jsonwebtoken";
import { db } from "../connect.js";
export const CreateBookmark = (req, res) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json("Not logged in");

  jwt.verify(token, process.env.JWT_KEY, async (err, userinfo) => {
    const q =
      "INSERT INTO bookmarks (`eventid`,`userid`,`businessid`) VALUES (?)";

    db.query(
      q,
      [[req.body.eventid, req.body.userid, req.body.businessid]],
      (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
      }
    );
  });
};
export const DeleteBookmark = (req, res) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json("Not logged in");

  jwt.verify(token, process.env.JWT_KEY, async (err, userinfo) => {
    const q = "DELETE FROM bookmarks WHERE userid = ? and eventid = ?";

    db.query(q, [req.query.userid, req.query.eventid], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};
export const GetBookmarks = (req, res) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json("Not logged in");

  jwt.verify(token, process.env.JWT_KEY, async (err, userinfo) => {
    let q = "";
    let val = null;
    if (req.query.userid && req.query.eventid) {
      q = "SELECT * FROM bookmarks WHERE userid = ? and eventid = ?";
      val = [req.query.userid, req.query.eventid];
    } else if (req.query.userid) {
      q = "SELECT * FROM bookmarks WHERE userid = ?";
      val = [[req.query.userid]];
    } else if (req.query.eventid) {
      q = "SELECT * FROM bookmarks WHERE eventid = ?";
      val = [[req.query.eventid]];
    }

    db.query(q, val, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};
