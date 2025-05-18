import express from 'express';
import { verifyToken } from '../middleware/verifyToken';

const router = express.Router();

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Ottieni i dati dell'utente autenticato
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dati utente
 *       401:
 *         description: Non autorizzato
 */
router.get('/profile', verifyToken, (req, res) => {
  res.json({ user: (req as any).user });
});

export default router;
