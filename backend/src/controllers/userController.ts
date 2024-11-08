import { Request, Response } from 'express';
import User from '../models/userModel';
import bcrypt from 'bcryptjs';

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, strategy } = req.body;

    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    user.strategy = strategy || user.strategy;

    if (password) {
      user.passHash = await bcrypt.hash(password, 10);
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user profile', error });
  }
};
