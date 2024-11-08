import { Router } from 'express';
import { addTransaction, getTransactionHistory } from '../controllers/transactionController';
import authMiddleware from '../auth/authMiddleware';

const router = Router();

router.post('/add', authMiddleware, addTransaction);
router.post('/get', authMiddleware, getTransactionHistory);

export default router;
