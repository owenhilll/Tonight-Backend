import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { db, s3 } from "../connect.js";
import jwt from "jsonwebtoken";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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

export const PresignedUrlImageUpload = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in");

  const type = req.body.fetchtype;
  jwt.verify(token, "secretkey", async (err, userinfo) => {
    const fileName = "business_" + req.query.id + "profile_pic";
    if (type == "getObject") {
      const params = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName,
        // Expires: 60,
        ContentType: "image/png", // URL valid for 60 seconds
      });

      return await getSignedUrl(type, params, { expiresIn: 60 });
    } else if (type == "putObject") {
      const params = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName,
        // Expires: 60,
        ContentType: "image/png", // URL valid for 60 seconds
      });

      return await getSignedUrl(type, params, { expiresIn: 60 });
    }
  });
};
