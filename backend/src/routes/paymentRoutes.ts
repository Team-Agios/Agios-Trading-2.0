import { Router } from 'express';
import { createPaymentIntent } from '../controllers/paymentController';
import authMiddleware from '../auth/authMiddleware'; 

const router = Router();

router.post('/create-payment-intent', authMiddleware, createPaymentIntent);


export default router;
