import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendCustomEmail = async (to: string, link: string) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.verify();
  console.log("✅ Connessione SMTP verificata");

  const info = await transporter.sendMail({
    from: `Brickly <${process.env.SMTP_USER}>`,
    to,
    subject: "Recupero password - Brickly",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px">
        <div style="text-align:center;margin-bottom:20px">
          <img src="https://brickly.cloud/logo.png" alt="Brickly" style="height:50px">
        </div>
        <h2 style="color:#0a5bb5">Recupero password Brickly</h2>
        <p>Hai richiesto di reimpostare la tua password per accedere al portale Brickly.</p>
        <p>
          <a href="${link}" style="background:#0a5bb5;color:white;padding:12px 24px;text-decoration:none;border-radius:4px;display:inline-block">
            Reimposta la password
          </a>
        </p>
        <p style="font-size:0.9em;color:#666">
          Se non sei stato tu a fare questa richiesta, puoi ignorare questa email.
        </p>
        <hr>
        <p style="font-size:0.8em;color:#aaa;text-align:center">Email automatica – non rispondere a questo indirizzo</p>
      </div>
    `,
  });

  console.log("📬 Info invio:", info);
};
