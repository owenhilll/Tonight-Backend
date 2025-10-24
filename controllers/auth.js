import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Geocoder from "react-native-geocoding";
export const register = (req, res) => {
  //check if user exists
  const q = "SELECT * FROM users WHERE email = ?";

  db.query(q, [req.body.email], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("User already exists!");

    const salt = bcrypt.genSaltSync(10);
    const hashedPW = bcrypt.hash(req.body.password, salt);
    hashedPW.then(function (result) {
      const q = "INSERT INTO users (`email`, `password`) VALUE (?)";

      const values = [req.body.email, result];

      db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("User created Successfully");
      });
    });
  });

  //create new user
};

const businessLogin = (req, res) => {
  const q = "SELECT * FROM businesses WHERE email = ?";

  db.query(q, [req.body.email], (err, data) => {
    if (err) return res.status(400).json(err);
    if (data.length === 0)
      return res.status(404).json({ message: "User not found!" });

    var result = bcrypt.compareSync(req.body.password, data[0].password);

    if (result) {
      const token = jwt.sign({ id: data[0].id }, "secretkey");

      const { password, ...others } = data[0];

      res
        .cookie("accessToken", token, { httpOnly: true })
        .status(200)
        .json({ data: { user: others, business: true } });
    } else {
      return res.status(400).json({ message: "Wrong username or password!" });
    }
  });
};

export const login = (req, res) => {
  const q = "SELECT * FROM users WHERE email = ?";
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  db.query(q, [req.body.email], (err, data) => {
    if (err) return res.status(400).json(err);
    if (data.length === 0) return businessLogin(req, res);

    var result = bcrypt.compareSync(req.body.password, data[0].password);

    if (result) {
      const token = jwt.sign({ id: data[0].id }, "secretkey");

      const { password, ...others } = data[0];

      res
        .cookie("accessToken", token, { httpOnly: true })
        .status(200)
        .json({ data: { user: others, business: false } });
    } else {
      return res.status(400).json({ message: "Wrong username or password!" });
    }
  });
};

export const logout = (req, res) => {
  res
    .clearCookie("accessToken", { secure: true, sameSite: "none" })
    .status(200)
    .json("User has been Logged out!");
};

export const registerBusiness = (req, res) => {
  //check if user exists
  const q = "SELECT * FROM businesses WHERE email = ?";
  db.query(q, [req.body.email], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length)
      return res
        .status(409)
        .json({ message: "Business with that email already exists!" });

    Geocoder.from(req.body.address)
      .then((json) => {
        let coords = json.results[0].geometry.location;
        const salt = bcrypt.genSaltSync(10);
        const hashedPW = bcrypt.hash(req.body.password, salt);
        hashedPW.then(function (result) {
          const q =
            "INSERT INTO businesses SET name='" +
            req.body.name +
            "', email='" +
            req.body.email +
            "', password='" +
            result +
            "', address='" +
            req.body.address +
            "', coordinates=POINT(" +
            coords.lng +
            ", " +
            coords.lat +
            ")";

          db.query(q, (err, data) => {
            console.log(err);
            if (err) return res.status(500).json(err);

            return res.status(200).json("Business Register Successfully");
          });
        });
        //create new user
      })
      .catch((err) => {
        return res.status(500).json(err);
      });
  });
};
