import { Router } from 'express';
import { getAuthHeaders } from '../../utils/authHelpers';
import { getInsurances } from '../../services/insurance';

const router = Router();

router.get('/list', async (req, res, next) => {
  const auth = getAuthHeaders(req);
  const { data } = await getInsurances(auth);

  res.json(data);
});

export default router;
