import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  getOutlet,
  updateOutlet
} from '../controllers/outletController.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getOutlet);
router.put('/', updateOutlet);

export default router;
