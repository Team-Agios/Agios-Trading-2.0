import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Stock from '../models/stockModel';

export const getUserStocks = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const stocks = await Stock.find({ userId }).exec();

    if (!stocks || stocks.length === 0) {
      return res.status(405).json({ message: 'No stocks found for this user' });
    }

    return res.status(200).json(stocks);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
    return res.status(500).json({ message: 'Unknown server error' });
  }
};

export default {
  getUserStocks,
};
