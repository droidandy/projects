import { Router } from 'express';
import {
  getClientVehicle,
  updateClientVehicle,
  getClientVehicles,
  createClientVehicle,
  getClientAds,
  createClientVehicleExt,
  getApplicationsByVehicle,
  setClientInterestedToApplication,
  getClientVehicleExt,
  createClientVehicleTradeIn,
  getClientVehicleInfoDraft,
  makeClientVehicleRelease,
  createClientVehicleDraft,
  updateClientVehicleDraft,
  getClientAdsCount,
  getClientVehicleStatistics,
  createClientVehicleSimpleDraft,
  createClientVehicleCallDraft,
} from '../../services/clientVehicle';
import { getAuthHeaders } from '../../utils/authHelpers';

const router = Router();

router.get('/item/:vehicleId', async (req, res, next) => {
  try {
    const { vehicleId } = req.params;
    const auth = getAuthHeaders(req);
    const { data } = await getClientVehicle(vehicleId, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/itemExt/:vehicleId', async (req, res, next) => {
  try {
    const { vehicleId } = req.params;
    const auth = getAuthHeaders(req);
    const { data } = await getClientVehicleExt(vehicleId, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/list', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const { data } = await getClientVehicles(auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/ads', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const params = req.query;

    const { data } = await getClientAds(auth, params);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/ads-count', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);

    const { data } = await getClientAdsCount(auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.post('/create', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const params = req.body;

    const { data } = await createClientVehicle(params, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.post('/createExt', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const params = req.body;

    const { data } = await createClientVehicleExt(params, auth);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.put('/update/:vehicleId', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const { vehicleId } = req.params;
    const params = req.body;

    const { data } = await updateClientVehicle(vehicleId, params, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/applicationList/:vehicleId', async (req, res, next) => {
  try {
    const { vehicleId } = req.params;

    const auth = getAuthHeaders(req);
    const { data } = await getApplicationsByVehicle(vehicleId, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.put('/application/:applicationId/interested', async (req, res, next) => {
  try {
    const { applicationId } = req.params;

    const auth = getAuthHeaders(req);
    const { data } = await setClientInterestedToApplication(applicationId, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.post('/create/trade-in', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const params = req.body;

    const { data: createData } = await createClientVehicleTradeIn(params, auth);

    res.json(createData);
  } catch (e) {
    next(e);
  }
});

router.get('/draft/:id', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const { id } = req.params;
    const { data } = await getClientVehicleInfoDraft(id as string, auth);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.post('/draft/create', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const { body } = req;
    const { data } = await createClientVehicleDraft(body, auth);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.put('/draft/update', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const { body } = req;
    const { data } = await updateClientVehicleDraft(body, auth);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.put('/draft/release', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const { body } = req;
    const { data } = await makeClientVehicleRelease(body, auth);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.post('/draft/simple-draft', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const { body } = req;
    const { data } = await createClientVehicleSimpleDraft(body, auth);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.post('/draft/call-draft', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const { body } = req;
    const { data } = await createClientVehicleCallDraft(body, auth);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/statistics/:vehicleId', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const { vehicleId } = req.params;
    const { data } = await getClientVehicleStatistics(vehicleId, auth);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

export default router;
