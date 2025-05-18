import { Request, Response } from 'express';
import { dbOperativo } from '../db/operativo';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await dbOperativo.password.findFirst({
      where: { username, attivo: true }
    });

    if (!user) return res.status(401).json({ error: 'Utente non trovato o disattivato' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Password errata' });

    const token = jwt.sign(
      { userId: user.id, ruolo: user.ruolo, username: user.username },
      process.env.JWT_SECRET!,
      { expiresIn: '12h' }
    );

    res.json({
      token,
      username: user.username,
      ruolo: user.ruolo
    });
  } catch (err) {
    console.error('Errore login:', err); // 👈 AGGIUNGI QUESTO
    res.status(500).json({ error: 'Errore durante il login' });
  }
 
};
