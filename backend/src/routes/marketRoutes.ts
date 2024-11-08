import { Router } from 'express';
import { getMarketSummary, getMarketSummary10, getMarketNews } from '../controllers/marketController';

const router = Router();

router.get('/market-summary', getMarketSummary);
router.get('/market-summary10', getMarketSummary10);
router.get('/market-news', getMarketNews);

export default router;
