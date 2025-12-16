import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  getDailyData,
  updateDailyData,
  resetDailyData
} from '../controllers/dailyDataController.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getDailyData);
router.put('/', updateDailyData);
router.post('/reset', resetDailyData);

export default router;
