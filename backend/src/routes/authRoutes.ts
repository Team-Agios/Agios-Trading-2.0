import { Router } from 'express';
import { register, login, verify, verifyOtp, forgotPassword, resetPassword } from '../auth/authController';

const router = Router();

router.post('/register', register);
router.get('/verify/:token', verify);
router.post('/login', login);
router.post('/verify-otp', verifyOtp);
router.post('/forgot-password', forgotPassword);
router.post('reset-password/:token', resetPassword);

export default router;