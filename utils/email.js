import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_ACCT,
    pass: process.env.GMAIL_PW,
  },
});

export function sendEmail(mailOptions) {
  try {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) return false;
      return true;
    });
  } catch (err) {
    return false;
  }

  return true;
}
