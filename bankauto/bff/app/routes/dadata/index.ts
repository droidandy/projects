import { Router } from 'express';
import { getAddressSuggestion, getPartySuggestion } from '../../services/dadata';

const router = Router();

router.post('/suggest/address', async (req, res, next) => {
  try {
    const { query } = req.body;

    const { data } = await getAddressSuggestion(query);

    res.json(data.suggestions);
  } catch (e) {
    next(e);
  }
});

router.post('/suggest/party', async (req, res, next) => {
  try {
    const { query } = req.body;

    const { data } = await getPartySuggestion(query);

    res.json(data.suggestions);
  } catch (e) {
    next(e);
  }
});

export default router;
