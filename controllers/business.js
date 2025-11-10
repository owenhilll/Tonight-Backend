import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { db, s3 } from "../connect.js";
import jwt from "jsonwebtoken";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

//Get a business
export const getBusiness = (req, res) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json("Not logged in");

  jwt.verify(token, "secretkey", async (err, userinfo) => {
    const userid = req.params.businessid;
    if (!userid) return res.status(500).json("Invallid business ID");
    const q = "SELECT * FROM businesses WHERE id = ?";
    db.query(q, [userid], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.length == 0)
        return res
          .status(404)
          .json({ message: "No businnes found with ID = " + userid });
      const { password, ...info } = data[0];
      return res.json(info);
    });
  });
};

//Register a business or event
export const updateBusinessInfomation = (req, res) => {
  const token = req.body.headers.Authorization;

  if (!token) return res.status(401).json("Not logged in");

  jwt.verify(token, "secretkey", async (err, userinfo) => {
    const q = "UPDATE businesses SET website = ?, number = ? WHERE id = ?";

    db.query(
      q,
      [req.body.website, req.body.number, req.body.id],
      (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Successfully update user website");
      }
    );
  });
};

export const PresignedUrlImageUpload = (req, res) => {
  const type = req.query.fetchtype;
  const token = req.headers.authorization;

  if (!token) return res.status(401).json("Not logged in");

  jwt.verify(token, "secretkey", async (err, userinfo) => {
    const fileName = "business_" + req.query.id + "_profile_pic";
    if (type == "getObject") {
      const params = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName,
        // Expires: 60,
        ContentType: "image/png", // URL valid for 60 seconds
      });

      const signedUrl = await getSignedUrl(s3, params, { expiresIn: 60 });
      return res.json(signedUrl);
    } else if (type == "putObject") {
      const params = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName,
        // Expires: 60,
        ContentType: "image/png", // URL valid for 60 seconds
      });

      const signedUrl = await getSignedUrl(s3, params, { expiresIn: 60 });
      return res.json(signedUrl);
    }
  });
};
