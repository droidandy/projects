import { Router } from 'express';
import {
  checkPresetnExpocarInCity,
  createInspectionVehicle,
  getInspectionByVehicleId,
  getInspectionsVehicle,
  removeInspectionVehicle,
} from './../../services/clientExpocar';
import { getAuthHeaders } from '../../utils/authHelpers';

const router = Router();

router.get('/inspections', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const { data } = await getInspectionsVehicle(auth);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.delete('/inspections/remove-item/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const auth = getAuthHeaders(req);
    const { data } = await removeInspectionVehicle(id, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.post('/inspections/create', async (req, res, next) => {
  try {
    const { vehicleId } = req.body;
    const auth = getAuthHeaders(req);
    const { data } = await createInspectionVehicle(vehicleId, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/available-city/:cityId', async (req, res, next) => {
  try {
    const { cityId } = req.params;
    const { data } = await checkPresetnExpocarInCity(cityId);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/inspection-for-vehicle/:vehicleId', async (req, res, next) => {
  try {
    const { vehicleId } = req.params;
    const auth = getAuthHeaders(req);
    const { data } = await getInspectionByVehicleId(vehicleId, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

export default router;
