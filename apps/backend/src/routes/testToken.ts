import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  // @ts-ignore
  const utente = req.utente;

  if (!utente) {
    return res.status(401).json({ error: "Utente non autenticato" });
  }

  return res.json({ message: "Token valido", utente });
});

export default router;
