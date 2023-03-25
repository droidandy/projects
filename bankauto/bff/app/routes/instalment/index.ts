import { Router } from 'express';
import {
  getBestInstalmentOffers,
  getInstalmentItem,
  getInstalmentsList,
  getInstalmentsMeta,
  getInstalmentsSimilar,
  getFilterData,
  getBrandsShort,
} from '../../services/instalment';

const router = Router();

router.get('/list', async (req, res, next) => {
  try {
    const params = req.query;

    const data = await getInstalmentsList(params);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/item/:brandAlias/:modelAlias/:vehicleId', async (req, res, next) => {
  try {
    const { brandAlias, modelAlias, vehicleId } = req.params;

    const data = await getInstalmentItem(brandAlias, modelAlias, vehicleId);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/best-offers', async (req, res, next) => {
  try {
    const data = await getBestInstalmentOffers(req.query);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/similar/:vehicleId', async (req, res, next) => {
  try {
    const { vehicleId } = req.params;

    const data = await getInstalmentsSimilar(vehicleId);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/list/meta', async (req, res, next) => {
  try {
    const params = req.query;

    const { data } = await getInstalmentsMeta(params);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/filter-data', async (req, res, next) => {
  try {
    const data = await getFilterData(req.query);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/brandsShort', async (req, res, next) => {
  try {
    const { type } = req.body;
    const data = await getBrandsShort(type, req.query);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

export default router;
