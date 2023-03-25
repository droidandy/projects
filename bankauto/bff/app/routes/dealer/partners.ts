import { Router } from 'express';
import { getAuthHeaders } from '../../utils/authHelpers';
import { getPartners } from '../../services/dealerPartners';

const router = Router();

router.get('/list', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const { data } = await getPartners(auth);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

export default router;
