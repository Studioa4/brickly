import express from "express";
import bcrypt from "bcrypt";

const router = express.Router();
const mockTokenStore = new Map<string, string>(); // email -> token
const mockUserDB = new Map<string, any>(); // email -> { passwordHash }

router.post("/api/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword)
    return res.status(400).json({ error: "Dati mancanti" });

  // cerca il token (mock)
  let emailMatch = null;
  for (const [email, storedToken] of mockTokenStore.entries()) {
    if (storedToken === token) {
      emailMatch = email;
      break;
    }
  }

  if (!emailMatch)
    return res.status(400).json({ error: "Token non valido o scaduto" });

  const passwordHash = await bcrypt.hash(newPassword, 10);
  mockUserDB.set(emailMatch, { passwordHash });

  // rimuove il token usato
  mockTokenStore.delete(emailMatch);

  return res.json({ message: "Password aggiornata con successo" });
});

export default router;
