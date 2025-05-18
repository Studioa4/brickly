import express from "express";
import { Request, Response } from "express";

const router = express.Router();

// GET /api/me - restituisce l'utente attualmente autenticato
router.get("/", (req: Request, res: Response) => {
  if (!req.utente) {
    return res.status(401).json({ error: "Non autenticato" });
  }

  return res.json(req.utente);
});

export default router;