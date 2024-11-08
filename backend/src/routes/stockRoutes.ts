import { Router } from 'express';
import stockController from '../controllers/stockController';

const router = Router();

router.get('/get/:userId', (req, res) => {
    console.log('Route matched');
    stockController.getUserStocks(req, res);
  });
  

export default router;
