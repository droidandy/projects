import { Router } from 'express';

import { getFullLink } from '../../services/marketing';

const router = Router();

router.get('/short-link/original-link/:hash', async (req, res, next) => {
  try {
    const { hash } = req.params;

    const { data } = await getFullLink(hash);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

export default router;
