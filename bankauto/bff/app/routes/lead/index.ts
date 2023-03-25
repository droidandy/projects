import { Router } from 'express';
import {
  createApplicationExpress,
  createApplicationSubscription,
  createApplicationTestDrive,
} from '../../services/lead';
import { getAuthHeaders } from '../../utils/authHelpers';
const router = Router();

router.post('/express', async (req, res, next) => {
  try {
    const { name, phone, needTradeIn, needCredit, vehicleId, vehicleColor } = req.body;
    const { data } = await createApplicationExpress(name, phone, needTradeIn, needCredit, vehicleId, vehicleColor);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.post('/test-drive', async (req, res, next) => {
  try {
    const { vehicleId } = req.body;
    const auth = getAuthHeaders(req);
    const { data } = await createApplicationTestDrive(vehicleId, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.post('/subscription', async (req, res, next) => {
  try {
    const { vehicleId } = req.body;
    const auth = getAuthHeaders(req);
    const { data } = await createApplicationSubscription(vehicleId, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

export default router;
