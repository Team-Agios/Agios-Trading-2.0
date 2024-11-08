import { Request, Response } from 'express';
import axios from 'axios';

const NEWS_API_URL = 'https://newsapi.org/v2/top-headlines';
const NEWS_API_KEY = process.env.NEWS_API_KEY;
const FINNHUB_API_URL = 'https://finnhub.io/api/v1';
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

interface StockSymbol {
    symbol: string;
    type: string;
}

interface StockData {
    c: number;
    h: number;
    l: number;
    o: number;
    pc: number;
}

const topSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'FB', 'NFLX', 'NVDA', 'BABA', 'DIS'];

const getTopStocks = async (count: number): Promise<string[]> => {
    try {
        return topSymbols.slice(0, count);
    } catch (error) {
        console.error('Error fetching stock symbols:', error);
        throw new Error('Error fetching stock symbols');
    }
};

const fetchStockData = async (symbols: string[]): Promise<any[]> => {
    const stockPromises = symbols.map(symbol =>
        axios.get<StockData>(`${FINNHUB_API_URL}/quote?symbol=${symbol}`, {
            headers: {
                'X-Finnhub-Token': FINNHUB_API_KEY
            }
        })
    );

    const stockResponses = await Promise.all(stockPromises);

    return stockResponses.map((response, index) => {
        if (response.status !== 200) {
            console.error(`Error fetching data for symbol ${symbols[index]}: Status ${response.status}`);
            return null;
        }

        const data = response.data;

        if (!data) {
            console.error(`Malformed response for symbol ${symbols[index]}:`, response.data);
            return null;
        }

        return {
            symbol: symbols[index],
            currentPrice: data.c,
            highPrice: data.h,
            lowPrice: data.l,
            openPrice: data.o,
            previousClosePrice: data.pc
        };
    }).filter(stock => stock !== null);
};

export const getMarketSummary = async (req: Request, res: Response) => {
    if (!FINNHUB_API_KEY) {
        return res.status(500).json({ message: 'Stock API key is not set' });
    }

    try {
        const stockSymbols = await getTopStocks(3); 
        const stocks = await fetchStockData(stockSymbols);

        res.status(200).json({ stocks });
    } catch (error) {
        console.error('Error fetching market summary:', error);
        res.status(500).json({ message: 'Error fetching market summary', error: String(error) });
    }
};

export const getMarketSummary10 = async (req: Request, res: Response) => {
    if (!FINNHUB_API_KEY) {
        return res.status(500).json({ message: 'Stock API key is not set' });
    }

    try {
        const stockSymbols = await getTopStocks(10); 
        const stocks = await fetchStockData(stockSymbols);

        res.status(200).json({ stocks });
    } catch (error) {
        console.error('Error fetching market summary:', error);
        res.status(500).json({ message: 'Error fetching market summary', error: String(error) });
    }
};

export const getMarketNews = async (req: Request, res: Response) => {
    if (!NEWS_API_KEY) {
        return res.status(500).json({ message: 'News API key is not set' });
    }

    try {
        const newsResponse = await axios.get(`${NEWS_API_URL}?category=business&language=en&apiKey=${NEWS_API_KEY}`);
        const news = newsResponse.data.articles;

        res.status(200).json({ news });
    } catch (error) {
        console.error('Error fetching market news:', error);
        res.status(500).json({ message: 'Error fetching market news', error });
    }
};
