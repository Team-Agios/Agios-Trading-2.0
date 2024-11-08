import { Router } from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/userController';
import authMiddleware from '../auth/authMiddleware';

const router = Router();

router.get('/profile', authMiddleware, getUserProfile);
router.put('/update', authMiddleware, updateUserProfile);

export default router;
