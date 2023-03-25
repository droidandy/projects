import { Router } from 'express';
import { getAuthHeaders } from '../../utils/authHelpers';
import { getSellerInfo } from '../../services/clientVehicle';

const router = Router();

router.get('/info/:vehicleId', async (req, res, next) => {
  try {
    const { vehicleId } = req.params;
    const auth = getAuthHeaders(req);
    const { data } = await getSellerInfo(vehicleId, auth);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

export default router;
