import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ path: __dirname + "/../../.env" });

(async () => {
  try {
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
    console.log("✅ Login SMTP Office 365 riuscito");
  } catch (err) {
    console.error("❌ Errore autenticazione SMTP Office 365:", err);
  }
})();
