import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendCustomEmail = async (to: string, link: string) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.verify();
  console.log("✅ Connessione SMTP Aruba verificata");

  const info = await transporter.sendMail({
    from: `Brickly <${process.env.SMTP_USER}>`,
    to,
    subject: "Recupero password Brickly",
    html: `
      <p>Ciao,</p>
      <p>Hai richiesto di reimpostare la tua password per Brickly.</p>
      <p><a href="${link}">Clicca qui per scegliere una nuova password</a></p>
      <p>Se non sei stato tu a fare la richiesta, ignora questa email.</p>
    `,
  });

  console.log("📬 Info invio:", info);
};
