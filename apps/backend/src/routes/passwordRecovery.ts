
import express from "express";
import { supabaseOperativo } from "../supabaseClient";
import { sendCustomEmail } from "../utils/mailer";

const router = express.Router();

router.post("/password-recovery", async (req, res) => {

  const { email } = req.body;
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

  try {
    const { data, error } = await supabaseOperativo.auth.admin.generateLink({
      type: "recovery",
      email,
      options: {
        redirectTo: `${frontendUrl}/reset-password`,
      },
    });

    if (error || !data || !data.properties || !data.properties.action_link) {
      console.error("Errore Supabase generateLink:", error);
      return res.status(500).json({ error: "Errore generazione link reset" });
    }

    await sendCustomEmail(email, data.properties.action_link);
    res.json({ message: "Email inviata con successo" });
  } catch (err) {
    console.error("Errore invio email:", err);
    res.status(500).json({ error: "Errore invio email" });
  }
});

export default router;
