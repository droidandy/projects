import { Router } from 'express';
import CacheMiddleware from '../../middlewares/cache';
import {
  getCatalogBrands,
  getBrand,
  getBrands,
  getBrandsShort,
  getCities,
  getExchangeRates,
  getFilterData,
  getFilterDataDeprecated,
  getModel,
  checkAlias,
  getSavingsAccountRates,
  getFinanceMainPageSections,
  getFinancePageInfo,
} from '../../services/catalog';

const CACHE_TTL = 3 * 60;
const catalogCacheMiddleware = CacheMiddleware(CACHE_TTL, { updateOnRequest: true });

const router = Router();

// will be deprecated by /filter-data
router.get('/data', catalogCacheMiddleware, async (req, res, next) => {
  try {
    const data = await getFilterDataDeprecated();
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/data-new', catalogCacheMiddleware, async (req, res, next) => {
  try {
    const data = await getFilterData(req.query);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/brands/:type', catalogCacheMiddleware, async (req, res, next) => {
  try {
    const { type } = req.params;
    const data = await getBrands(type);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/brandsShort/:type', catalogCacheMiddleware, async (req, res, next) => {
  try {
    const { type } = req.params;
    const data = await getBrandsShort(type, req.query);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/brand/:type/:id', catalogCacheMiddleware, async (req, res, next) => {
  try {
    const { type, id } = req.params;
    const data = await getBrand(type, id);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/model/:type/:id', catalogCacheMiddleware, async (req, res, next) => {
  try {
    const { type, id } = req.params;
    const data = await getModel(type, id);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/rates', async (req, res, next) => {
  try {
    const { type } = req.query;
    const exchangeRates = await getExchangeRates(type as string);
    res.json(exchangeRates);
  } catch (e) {
    next(e);
  }
});

router.get('/savings-account/rates', async (req, res, next) => {
  try {
    const exchangeRates = await getSavingsAccountRates();
    res.json(exchangeRates);
  } catch (e) {
    next(e);
  }
});

router.get('/cities', async (req, res, next) => {
  try {
    const cities = await getCities();
    res.json(cities);
  } catch (e) {
    next(e);
  }
});

router.get('/alias/check/:brand/:model?/:generation?', async (req, res, next) => {
  try {
    const { brand, model, generation } = req.params;
    const aliasesInfo = await checkAlias({ brand, model, generation });
    res.json(aliasesInfo);
  } catch (e) {
    next(e);
  }
});

router.get('/v1/brands/:type?', catalogCacheMiddleware, async (req, res, next) => {
  try {
    const { type } = req.params;
    const { distance, cityId } = req.query;

    const params = {
      type,
      cityId,
      distance,
    } as { type: string; cityId: string[] | null; distance: string };

    const data = await getCatalogBrands(params);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/banner/main-page-sections', async (req, res, next) => {
  try {
    const data = await getFinanceMainPageSections();
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/banner/list', async (req, res, next) => {
  try {
    const { alias } = req.query;
    const data = await getFinancePageInfo(alias as string);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

export default router;
