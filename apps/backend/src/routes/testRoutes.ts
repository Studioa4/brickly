import express from 'express';
import { getTest } from '../controllers/testController';
const router = express.Router();

/**
 * @swagger
 * /api/test:
 *   get:
 *     summary: Test di funzionamento
 *     responses:
 *       200:
 *         description: Ritorna un messaggio di test
 */
router.get('/test', getTest);

export default router;
