import nodemailer from "nodemailer";
import dotenv from 'dotenv'

dotenv.config()

export const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailBody={
      from: `"MyApp" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    }
    if (cc) {
      mailOptions.cc = cc;
    }
    await transporter.sendMail(mailBody);
    
    console.log("Email Send Successfully")
  } catch (error) {
    console.error("Email send failed:", error.message);
  }
};
