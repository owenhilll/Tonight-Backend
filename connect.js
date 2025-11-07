import mysql from "mysql2";
import * as dotenv from "dotenv";
import { S3Client } from "@aws-sdk/client-s3";

dotenv.config();
export const db = mysql.createConnection({
  host: "localhost",
  user: process.env.MASTER_USERNAME,
  password: process.env.PW,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    // Handle the error, e.g., exit the application, log the error, etc.
  } else {
    console.log("Successfully connected to MySQL!");
    // Proceed with database operations
  }
});

export const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
