import express from 'express';
import { login } from '../controllers/authController';
const router = express.Router();

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login utente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login riuscito
 *       401:
 *         description: Credenziali errate
 */
router.post('/login', login);

export default router;
