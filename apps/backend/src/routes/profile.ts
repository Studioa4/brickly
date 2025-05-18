import express from 'express';
import { verifyToken } from '../middleware/verifyToken';

const router = express.Router();

router.get('/api/profile', verifyToken, (req, res) => {
  const user = (req as any).user;
  res.json({ user });
});

export default router;
