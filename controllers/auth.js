import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { geocodeAddress } from "../index.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_ACCT,
    pass: process.env.GMAIL_PW,
  },
});

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
        .status(200)
        .json({ data: { user: others, business: true }, token: token });
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
        .status(200)
        .json({ data: { user: others, business: false }, token: token });
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

    geocodeAddress(req.body.address)
      .then((json) => {
        let coords = json.geometry.location;
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
            "', city='" +
            json.address_components[3].long_name +
            "', state='" +
            json.address_components[5].long_name +
            "', address='" +
            req.body.address +
            "', coordinates=POINT(" +
            coords.lng +
            ", " +
            coords.lat +
            ")";

          const mailOptions = {
            from: process.env.GMAIL_ACCT,
            to: process.env.GMAIL_ACCT,
            subject: "Registration Request: " + req.body.licenseID,
            text: q,
          };

          const mailOptions2 = {
            from: process.env.GMAIL_ACCT,
            to: req.body.email,
            subject: "Registration Request: " + req.body.licenseID,
            text: "We have recieved your business application! Our team will review your information get back to you within 2 business days.",
          };

          transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
              res.status(500).json(err);
            }
          });

          transporter.sendMail(mailOptions2, (err, info) => {
            if (err) {
              res.status(500).json(err);
            } else {
              res.status(200).json("Success");
            }
          });

          // nodemailer.createTransport(mailOptions2);

          // return res.status(200).json("Success");
        });
        //create new user
      })
      .catch((err) => {
        return res.status(500).json(err);
      });
  });
};
