import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendPasswordRecoveryEmail = async (to: string, token: string) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const resetUrl = `${process.env.RESET_LINK_BASE}?token=${token}`;

  await transporter.sendMail({
    from: `"Brickly" <${process.env.SMTP_USER}>`,
    to,
    subject: "Recupero password",
    html: `<p>Clicca qui per reimpostare la tua password:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
  });
};
