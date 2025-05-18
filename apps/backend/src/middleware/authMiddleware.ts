import { Request, Response, NextFunction } from "express";
import { supabaseAdmin } from "../supabaseClientAdmin";

export default async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1];

  console.log("🔑 Token ricevuto:", token);

  if (!token) {
    return res.status(401).json({ error: "Token mancante" });
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token);

  console.log("🔍 Risposta getUser:", { data, error });

  if (error || !data?.user) {
    console.warn("❌ Errore autenticazione:", error?.message);
    return res.status(401).json({ error: "Token non valido" });
  }

  req.utente = {
    id: data.user.id || data.user.user_metadata?.sub,
    email: data.user.email,
    nome: data.user.user_metadata?.nome || null,
    cognome: data.user.user_metadata?.cognome || null,
    is_superadmin: data.user.user_metadata?.is_superadmin || false,
    id_studio_corrente: data.user.user_metadata?.id_studio_corrente || null,
  };

  console.log("✅ Utente autenticato:", req.utente);

  next();
}
