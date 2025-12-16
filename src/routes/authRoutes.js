import express from 'express';
import { login, verify, logout } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.get('/verify', authenticateToken, verify);
router.post('/logout', logout);

export default router;
