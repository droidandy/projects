import { Router } from 'express';
import {
  getComparisonIds,
  getComparisonVehiclesNew,
  getComparisonVehiclesUsed,
  updateComparisonIds,
} from '../../services/comparison';
import { getAuthHeaders } from '../../utils/authHelpers';

const router = Router();

router.get('/ids', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const { data } = await getComparisonIds(auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.put('/ids', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const { body } = req;
    const { data } = await updateComparisonIds(auth, body);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/vehicles-new', async (req, res, next) => {
  try {
    const {
      query: { id: offerIds },
    } = req;

    const { data } = await getComparisonVehiclesNew(offerIds);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/vehicles-used', async (req, res, next) => {
  try {
    const {
      query: { id: offerIds },
    } = req;

    const { data } = await getComparisonVehiclesUsed(offerIds);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

export default router;
