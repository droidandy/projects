import { Router } from 'express';
import {
  getVehicle,
  getVehicleItem,
  getVehiclesTypeList,
  getVehiclesList,
  getVehiclesTypeCount,
  getVehiclesCount,
  getVehiclesSimilar,
  createVehicle,
  getBestOffers,
  getVehiclesMeta,
  getVehicleCreateData,
  createVehicleTradeIn,
  getVehiclesListShort,
  getBestOffersShort,
  getVehiclesSimilarShort,
  getVehicleItemNew,
  getVehicleCreateOptions,
  getVehicleItemColor,
  getAutotekaLink,
  getVehiclesBySpecialProgram,
  getVehicleStickersData,
} from '../../services/vehicle';
import { getAuthHeaders } from '../../utils/authHelpers';
import VehicleImportRouter from './import';
import CacheMiddleware from '../../middlewares/cache';
// import { vehicleMock } from '../../mocks/vehicleNew';
// import { vehicleColorsMock } from '../../mocks/vehicleColors';

const CACHE_TTL = 3 * 60;
const vehiclesCacheMiddleware = CacheMiddleware(CACHE_TTL, { updateOnRequest: true });

const router = Router();

router.use('/import', VehicleImportRouter);

router.get('/item/:vehicleId', async (req, res, next) => {
  try {
    const { vehicleId } = req.params;

    const { data } = await getVehicle(vehicleId);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

// deprecated
router.get('/item/:brandAlias/:modelAlias/:vehicleId', async (req, res, next) => {
  try {
    const { brandAlias, modelAlias, vehicleId } = req.params;

    const { data } = await getVehicleItem(brandAlias, modelAlias, vehicleId);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/v1/item/:brandAlias/:modelAlias/:vehicleId', async (req, res, next) => {
  try {
    const { brandAlias, modelAlias, vehicleId } = req.params;

    const { data } = await getVehicleItemNew(brandAlias, modelAlias, vehicleId);

    res.json(data);
    // res.json(vehicleMock);
  } catch (e) {
    next(e);
  }
});

router.get('/v1/item-color/:vehicleId', async (req, res, next) => {
  try {
    const { vehicleId } = req.params;

    const { data } = await getVehicleItemColor(vehicleId);

    res.json(data);
    // res.json(vehicleColorsMock);
  } catch (e) {
    next(e);
  }
});

// deprecated
router.get('/list', async (req, res, next) => {
  try {
    const params = req.query;

    const { data } = await getVehiclesList(params);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/v1/list', async (req, res, next) => {
  try {
    const params = req.query;

    const { data } = await getVehiclesListShort(params);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

// deprecated
router.get('/list/count', async (req, res, next) => {
  try {
    const params = req.query;

    const { data } = await getVehiclesCount(params);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/list/meta', vehiclesCacheMiddleware, async (req, res, next) => {
  try {
    const params = req.query;

    const { data } = await getVehiclesMeta(params);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

// deprecated
router.get('/list/:type', async (req, res, next) => {
  try {
    const { type } = req.params;
    const params = req.query;

    const { data } = await getVehiclesTypeList(type, { ...params });

    res.json(data);
  } catch (e) {
    next(e);
  }
});

// deprecated
router.get('/list/:type/count', async (req, res, next) => {
  try {
    const { type } = req.params;
    const params = req.query;

    const { data } = await getVehiclesTypeCount(type, params);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

// deprecated
router.get('/similar/:vehicleId', async (req, res, next) => {
  try {
    const { vehicleId } = req.params;

    const { data } = await getVehiclesSimilar(vehicleId);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/v1/similar/:vehicleId', async (req, res, next) => {
  try {
    const { vehicleId } = req.params;
    const { query } = req;

    const { data } = await getVehiclesSimilarShort(vehicleId, query);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/v1/autoteka/:vehicleId', async (req, res, next) => {
  try {
    const { vehicleId } = req.params;
    const { data } = await getAutotekaLink(vehicleId);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/create-data', async (req, res, next) => {
  try {
    const params = req.query;

    const { data } = await getVehicleCreateData(params);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/stickers-data', async (req, res, next) => {
  try {
    const { data } = await getVehicleStickersData();
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/create-options', async (req, res, next) => {
  try {
    const params = req.query;

    const { data } = await getVehicleCreateOptions(params);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.post('/create/trade-in', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const params = req.body;

    const { data: createData } = await createVehicleTradeIn(params, auth);

    res.json(createData);
  } catch (e) {
    next(e);
  }
});

router.post('/create', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const params = req.body;

    const { data: createData } = await createVehicle(params, auth);

    res.json(createData);
  } catch (e) {
    next(e);
  }
});

router.get('/special-offer/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { data } = await getVehiclesBySpecialProgram(id);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

// deprecated
router.get('/best-offers/:type', async (req, res, next) => {
  try {
    const { type } = req.params;
    const { data } = await getBestOffers(type);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/v1/best-offers/:type', async (req, res, next) => {
  try {
    const { type } = req.params;
    const { data } = await getBestOffersShort(type, req.query);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

export default router;
