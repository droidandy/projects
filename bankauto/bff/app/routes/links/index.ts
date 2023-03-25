import { Router } from 'express';
import { getLinksList } from '../../services/links';

const router = Router();

router.get('/list', async (req, res, next) => {
  try {
    const params = req.query;

    const data = await getLinksList(params);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

export default router;
