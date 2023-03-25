import { Router } from 'express';
import { getAuthHeaders } from '../../utils/authHelpers';
import {
  getDealerAppCount,
  getDealerVehicle,
  getDealerVehicles,
  getDealerVehiclesCount,
  getDealerViewsCount,
} from '../../services/dealerVehicle';

const router = Router();

router.get('/item/:vehicleId', async (req, res, next) => {
  try {
    const { vehicleId } = req.params;
    const auth = getAuthHeaders(req);

    const { data } = await getDealerVehicle(auth, vehicleId);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/list', async (req, res, next) => {
  try {
    const params = req.query;
    const auth = getAuthHeaders(req);

    const { data } = await getDealerVehicles(params, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/count', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);

    const { data } = await getDealerVehiclesCount(auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/app-count', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);

    const { data } = await getDealerAppCount(auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/views-count', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);

    const { data } = await getDealerViewsCount(auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

export default router;
