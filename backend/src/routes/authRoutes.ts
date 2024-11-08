import { Router } from 'express';
import { register, login, verify, verifyOtp } from '../auth/authController';

const router = Router();

router.post('/register', register);
router.get('/verify/:token', verify);
router.post('/login', login);
router.post('/verify-otp', verifyOtp);

export default router;