import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config({ path: __dirname + '/../../.env' });

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
    console.log('✅ Connessione SMTP verificata');

    const info = await transporter.sendMail({
      from: `Brickly Test <${process.env.SMTP_USER}>`,
      to: 'togni.fabry@gmail.com', // 👈 CAMBIA QUESTO
      subject: 'Test email semplice Brickly',
      text: 'Questo è un test di invio SMTP solo testo da Brickly (senza HTML).',
    });

    console.log('📬 Info invio:', info);
  } catch (err) {
    console.error('❌ Errore invio email:', err);
  }
})();
