import mysql from "mysql2";
import * as dotenv from "dotenv";

dotenv.config();
export const db = mysql.createConnection({
  host: process.env.RDS_ENDPOINT,
  port: 3306,
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
