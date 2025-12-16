import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  getCapitalFlows,
  createCapitalFlow,
  deleteCapitalFlow
} from '../controllers/capitalFlowController.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getCapitalFlows);
router.post('/', createCapitalFlow);
router.delete('/:id', deleteCapitalFlow);

export default router;
