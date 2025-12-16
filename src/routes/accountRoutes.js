import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  getAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
  getAccountBalances,
  updateAccountBalance
} from '../controllers/accountController.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getAccounts);
router.post('/', createAccount);
router.put('/:id', updateAccount);
router.delete('/:id', deleteAccount);
router.get('/balances', getAccountBalances);
router.put('/balances/update', updateAccountBalance);

export default router;
