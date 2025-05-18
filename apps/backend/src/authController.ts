import { Request, Response } from 'express';
import supabase from './supabase';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const { data, error } = await supabase
      .from('password')
      .select('*')
      .eq('username', username)
      .eq('attivo', true)
      .single();

    if (error || !data) {
      return res.status(401).json({ error: 'Credenziali non valide' });
    }

    const match = await bcrypt.compare(password, data.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Credenziali non valide' });
    }

    const token = jwt.sign(
      { userId: data.id, username: data.username, ruolo: data.ruolo },
      process.env.JWT_SECRET!,
      { expiresIn: '12h' }
    );

    res.json({ token, username: data.username, ruolo: data.ruolo });
  } catch (err) {
    console.error('Errore login:', err);
    res.status(500).json({ error: 'Errore interno' });
  }
};
