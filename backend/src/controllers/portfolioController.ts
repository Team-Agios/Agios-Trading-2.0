import { Request, Response } from 'express';
import Transaction from '../models/transactionModel';
import moment from 'moment';

interface PortfolioData {
  symbol: string;
  quantity: number;
  avgPrice: number;
  totalInvested: number;
  currentPrice?: number;
}

interface GraphData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  }[];
}

export const getPortfolioGraphData = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(400).json({ message: 'User ID not found' });
  }

  const mode = req.query.mode as string;
  if (!['week', 'month', 'year'].includes(mode)) {
    return res.status(400).json({ message: 'Invalid mode. Allowed values are: week, month, year' });
  }

  try {
    const now = moment();
    let startDate: moment.Moment = now;

    switch (mode) {
      case 'week':
        startDate = now.clone().subtract(1, 'week');
        break;
      case 'month':
        startDate = now.clone().subtract(1, 'month');
        break;
      case 'year':
        startDate = now.clone().subtract(1, 'year');
        break;
    }

    const transactions = await Transaction.find({
      userId,
      date: { $gte: startDate.toDate() },
    });

    const portfolio = transactions.reduce<{ [symbol: string]: PortfolioData }>((acc, transaction) => {
      const { symbol, quantity, price, type } = transaction;

      if (!acc[symbol]) {
        acc[symbol] = { symbol, quantity: 0, avgPrice: 0, totalInvested: 0 };
      }

      if (type === 'buy') {
        acc[symbol].quantity += quantity;
        acc[symbol].totalInvested += quantity * price;
        acc[symbol].avgPrice = acc[symbol].totalInvested / acc[symbol].quantity;
      } else if (type === 'sell') {
        acc[symbol].quantity -= quantity;
        acc[symbol].totalInvested -= quantity * price;
        acc[symbol].avgPrice = acc[symbol].totalInvested / acc[symbol].quantity;
      }

      return acc;
    }, {});

    const graphData: GraphData = {
      labels: Object.keys(portfolio),
      datasets: [
        {
          label: 'Total Invested',
          data: Object.values(portfolio).map(p => p.totalInvested),
        },
        {
          label: 'Average Price',
          data: Object.values(portfolio).map(p => p.avgPrice),
        },
      ],
    };

    res.status(200).json(graphData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching portfolio graph data', error });
  }
};
