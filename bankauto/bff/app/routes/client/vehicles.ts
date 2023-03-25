import { Router } from 'express';
import { deactivateClientVehicle, deleteClientVehicle, getClientAllVehicles } from '../../services/clientVehicle';
import { getAuthHeaders } from '../../utils/authHelpers';

const router = Router();

router.get('/list', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const { ids } = req.body;

    const { data } = await getClientAllVehicles(ids, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.put('/vehicle/:vehicleId/deactivate', async (req, res, next) => {
  try {
    const { vehicleId } = req.params;
    const { cancelReason } = req.body;
    const auth = getAuthHeaders(req);
    const { data } = await deactivateClientVehicle(vehicleId, auth, cancelReason);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.delete('/vehicle/:vehicleId', async (req, res, next) => {
  try {
    const { vehicleId } = req.params;
    const auth = getAuthHeaders(req);
    const { data } = await deleteClientVehicle(vehicleId, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

export default router;
