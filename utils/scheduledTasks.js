import { CreateSessionOutputFilterSensitiveLog } from "@aws-sdk/client-s3";
import "node-cron";
import nodeCron from "node-cron";
import { db } from "../connect.js";

function clearPastEvents() {
  const q =
    "DELETE FROM social.events WHERE DATE_ADD(date, INTERVAL duration HOUR) < CURDATE()";

  db.query(q, (err, info) => {
    if (err) console.log("Failed to run hourly delete");
    console.log("Executred delete " + new Date().toLocaleString());
  });

  const q2 =
    "DELETE FROM social.promoted WHERE DATE_ADD(date, INTERVAL duration HOUR) < NOW()";

  db.query(q2, (err, info) => {
    if (err) console.log("Failed to run hourly delete");
    console.log("Executred delete " + new Date().toLocaleString());
  });
}

nodeCron.schedule("0 * * * *", clearPastEvents);
