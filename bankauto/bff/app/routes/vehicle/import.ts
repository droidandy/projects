import { VEHICLE_TYPE } from '@marketplace/ui-kit/types';
import { Router } from 'express';
import { addImportFeed, deleteImportFeed, getImportFeed, getVehicleImportLog } from '../../services/vehicleImport';
import { getAuthHeaders } from '../../utils/authHelpers';

const router = Router();

router.get('/log', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);

    const { data } = await getVehicleImportLog(auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/feed/:type', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const { type } = req.params;

    const { data } = await getImportFeed(auth, type as VEHICLE_TYPE);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.post('/feed/:type', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const { type } = req.params;

    const { data } = await addImportFeed(auth, type as VEHICLE_TYPE, req.body);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.delete('/feed/:type', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const { type } = req.params;

    const { data } = await deleteImportFeed(auth, type as VEHICLE_TYPE);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

export default router;
