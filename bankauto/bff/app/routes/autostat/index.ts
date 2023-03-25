import { Router } from 'express';
import { getAuthHeaders } from '../../utils/authHelpers';
import { getVehiclePrice, getVehiclePriceByParams } from '../../services/autostat';

const router = Router();

router.get('/price', async (req, res, next) => {
  try {
    const params = req.query;
    const auth = getAuthHeaders(req);

    const { data } = await getVehiclePrice(params, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/price-by-params', async (req, res, next) => {
  try {
    const params = req.query;
    const auth = getAuthHeaders(req);

    const { data } = await getVehiclePriceByParams(params, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

export default router;
