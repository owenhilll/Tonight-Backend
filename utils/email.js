import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,

  auth: {
    user: process.env.BUSINESS_REG,
    pass: process.env.BUSINESS_REG_PW,
  },
});

export async function sendRegistrationEmail(mailOptions) {
  try {
    const info = await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

const supportTransporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: process.env.SUPPORT,
    pass: process.env.SUPPORT_PW,
  },
});

export async function sendSupportEmail(mailOptions) {
  try {
    await supportTransporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }

  return true;
}
