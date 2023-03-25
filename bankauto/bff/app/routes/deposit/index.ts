import { Router } from 'express';
import { getDepositRates } from '../../services/deposit';

const router = Router();

router.get('/rates', async (req, res, next) => {
  try {
    const params = req.query;
    const { data } = await getDepositRates(params);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

export default router;
