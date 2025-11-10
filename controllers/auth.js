import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { geocodeAddress } from "../utils/Geocoder.js";

import { sendRegistrationEmail, sendSupportEmail } from "../utils/email.js";
import { createHash, randomBytes } from "crypto";

export const register = (req, res) => {
  //check if user exists
  const q = "SELECT * FROM users WHERE email = ?";

  db.query(q, [req.body.email], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("User already exists!");

    const salt = bcrypt.genSaltSync(10);
    const hashedPW = bcrypt.hash(req.body.password, salt);
    console.log(hashedPW);
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
      const token = jwt.sign({ id: data[0].id }, process.env.JWT_KEY);

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
      const token = jwt.sign({ id: data[0].id }, process.env.JWT_KEY);

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
  const q = "SELECT * FROM users WHERE email = ?";
  db.query(q, [req.body.email], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length)
      return res
        .status(409)
        .json({ message: "Business with that email already exists!" });

    geocodeAddress(req.body.address)
      .then(async (json) => {
        let coords = json.geometry.location;
        const salt = bcrypt.genSaltSync(10);
        const hashedPW = bcrypt.hash(req.body.password, salt);
        hashedPW.then(async (result) => {
          console.log(result);
          const q = `INSERT INTO businesses (name, email, password, city, state, address, coordinates) VALUES ('${req.body.name}','${req.body.email}','${result}','${json.address_components[3].long_name}','${json.address_components[5].long_name}','${req.body.address}', POINT(${coords.lng}, ${coords.lat}))`;

          db.query(q, (err, info) => {
            if (err) console.log(err);
            else console.log(info);
          });

          // const mailOptions = {
          //   from: process.env.BUSINESS_REG,
          //   to: process.env.BUSINESS_REG,
          //   subject:
          //     "Registration Request: " +
          //     req.body.licenseID +
          //     " cell: " +
          //     req.body.number,
          //   text: q,
          // };

          // const mailOptions2 = {
          //   from: process.env.BUSINESS_REG,
          //   to: req.body.email,
          //   subject: "Registration Request: " + req.body.licenseID,
          //   text: "We have recieved your business application! Our team will review your information get back to you within 2 business days.",
          // };

          // const email1 = await sendRegistrationEmail(mailOptions);
          // const email2 = await sendRegistrationEmail(mailOptions2);

          // if (!email1 || !email2) {
          //   return res.status(500).json({ message: "Error sending email" });
          // } else {
          //   return res.status(200).json({ message: "Success" });
          // }
        });
      })
      .catch((err) => {
        return res.status(500).json({ message: err });
      });
  });
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const findUser = "SELECT * FROM users WHERE email = ?";
    db.query(findUser, [email], (err, userData) => {
      let user = {};
      if (err) return res.status(500).json(err);
      if (userData.length === 0) {
        const findBusiness = "SELECT * FROM businesses WHERE email = ?";
        db.query(findBusiness, [email], (err, businessData) => {
          if (businessData.length === 0) {
            return res.status(409).json("User not Found!");
          } else {
            user = businessData[0];
          }
        });
      } else {
        user = userData[0];
      }

      const token = randomBytes(20).toString("hex");
      const resetToken = createHash("sha256").update(token).digest("hex");
      const createdAt = new Date().toISOString();
      const expiresAt = new Date(
        Date.now() + 60 * 60 * 24 * 1000
      ).toISOString();

      const deleteToken = "DELETE FROM reset_tokens WHERE email = ?";
      db.query(deleteToken, [email], () => {});

      const updateToken = `INSERT INTO reset_tokens(token, created_at, expires_at, email) VALUES ('${resetToken}', '${createdAt}', '${expiresAt}', '${email}')`;

      db.query(updateToken, async (err, data) => {
        if (err) return res.status(500).json("Failed to update reset token");

        const mailOption = {
          from: process.env.SUPPORT,
          to: email,
          subject: "Locale: Password Reset",
          html: `<div>
                  <h1>Locale: Password Reset Request</h1>
                  <h5>We have received a password reset request for your account</h5>
                  <h5>To reset your password, click the link below.</h5>
                  <a href="${process.env.FRONTEND_URL}/ResetPassword?email=${email}&token=${resetToken}">Reset Password</a>
                  <hr />
                  <h1><span style="color: #ff9900;">Locale App</span></h1>
                  <h3>Discover your area!</h3>
                  <div><u><a href="https://localeapplive.com">https://localeapplive.com</a></u></div>
                  <div>&nbsp;</div>
                  <div><strong>Support</strong>: support@localeapplive.com</div>
                </div>`,
        };
        const mailStatus = await sendSupportEmail(mailOption);
        if (mailStatus) {
          return res
            .status(200)
            .json("A password reset link has been sent to your email.");
        } else {
          return res.status(500).json("Failed to send email");
        }
      });
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { password, token, email } = req.body;
    const q = `SELECT token, expires_at FROM reset_tokens WHERE email = '${email}' ORDER BY created_at DESC LIMIT 1`;
    db.query(q, async (err, data) => {
      if (data.length === 0) {
        return res.json(500).json("No refresh token found");
      }

      const currDate = new Date();
      const expiresAt = new Date(data[0].expires_at);

      if (currDate > expiresAt) {
        return res.status(500).json("Token expired!");
      } else if (data[0].token !== token) {
        return res.status(500).json("Invalid Link");
      } else {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const findUser = "SELECT * FROM users WHERE email = ?";
        db.query(findUser, [email], (err, data) => {
          let q = "";
          if (data.length === 0) {
            q = `UPDATE businesses SET password = '${hashedPassword}' WHERE email = '${email}'`;
          } else {
            q = `UPDATE users SET password = '${hashedPassword}' WHERE email = '${email}'`;
          }

          db.query(q, (err, info) => {
            if (err) return res.status(500).json("Error");
            else {
              const deleteToken = "DELETE FROM reset_tokens WHERE email = ?";
              db.query(deleteToken, [email], () => {});
              return res.status(200).json("Success");
            }
          });
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
};
