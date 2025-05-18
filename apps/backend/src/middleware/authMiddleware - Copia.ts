import { Request, Response, NextFunction } from "express";
import { supabase } from "../lib/supabaseClient";

export default async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token mancante" });
  }

  const token = authHeader.replace("Bearer ", "").trim();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ error: "Token non valido" });
  }

  req.utente = {
    id: user.id,
    email: user.email || undefined,
    nome: user.user_metadata?.nome || undefined,
    is_superadmin: user.user_metadata?.is_superadmin || false,
    id_studio_corrente: user.user_metadata?.id_studio_corrente || null
  };

  next();
}