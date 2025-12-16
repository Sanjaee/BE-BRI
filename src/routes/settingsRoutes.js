import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  getSettings,
  updateSettings,
  resetSettings
} from '../controllers/settingsController.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getSettings);
router.put('/', updateSettings);
router.post('/reset', resetSettings);

export default router;
