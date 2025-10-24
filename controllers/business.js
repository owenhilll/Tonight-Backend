import { db } from "../connect.js";
import jwt from "jsonwebtoken";
//Get a business
export const getBusiness = (req, res) => {
  const userid = req.params.businessid;
  if (!userid) return res.status(500).json("Invallid business ID");
  const q = "SELECT * FROM businesses WHERE id = ?";
  db.query(q, [userid], (err, data) => {
    if (err) return res.status(500).json(err);
    const { password, ...info } = data[0];
    return res.json(info);
  });
};

//Register a business or event
export const setBusiness = (req, res) => {
  const q =
    "INSERT INTO businesses (`name`,`category`,`password`, `email`) VALUES = (?)";

  const values = [
    req.body.name,
    req.body.category,
    req.body.password,
    req.body.email,
  ];

  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    const { password, ...info } = data[0];
    return res.json(info);
  });
};

export const setProfilePic = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in");
  const pic = req.body.pic;
  jwt.verify(token, "secretkey", (err, userinfo) => {
    const q = "UPDATE businesses SET profilepic = ? WHERE id = ?";
    console.log(q);
    db.query(q, [pic, userinfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};
