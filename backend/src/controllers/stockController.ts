import axios from 'axios';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Stock from '../models/stockModel';

const FINNHUB_API_URL = 'https://finnhub.io/api/v1';
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

const getFinnhubData = async (symbol: string) => {
  try {
    const response = await axios.get(`${FINNHUB_API_URL}/quote`, {
      params: {
        symbol,
        token: FINNHUB_API_KEY,
      },
    });

    const logoResponse = await axios.get(`${FINNHUB_API_URL}/stock/profile2`, {
      params: {
        symbol,
        token: FINNHUB_API_KEY,
      },
    });

    return {
      currentPrice: response.data.c,
      logo: logoResponse.data.logo,
    };
  } catch (error) {
    console.error(`Error fetching data from Finnhub for symbol: ${symbol}`, error);
    return null;
  }
};

export const getUserStocks = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid or missing user ID' });
    }

    const stocks = await Stock.find({ userId }).exec();

    if (!stocks || stocks.length === 0) {
      return res.status(404).json({ message: 'No stocks found for this user' });
    }

    const filteredStocks = await Promise.all(
      stocks.map(async (stock) => {
        if (stock.quantity <= 0) {
          return null;
        }

        const finnhubData = await getFinnhubData(stock.symbol);

        if (!finnhubData) {
          return null;
        }

        return {
          symbol: stock.symbol,
          logo: finnhubData.logo,
          currentPrice: finnhubData.currentPrice,
          totalSpent: stock.quantity * stock.averagePrice,
        };
      })
    );

    const validStocks = filteredStocks.filter((stock) => stock !== null);

    return res.status(200).json(validStocks);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
    return res.status(500).json({ message: 'Unknown server error' });
  }
};