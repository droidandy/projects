import { Router } from 'express';
import { getAuthHeaders } from '../../utils/authHelpers';
import {
  reviews,
  reviewsById,
  workAutocomplete,
  carBrand,
  carModel,
  carGeneration,
  carYears,
  mapServices,
  orderCreate,
  user,
  getUser,
  getUserAuto,
  orders,
  cancelOrder,
  editOrder,
  mapSearch,
  service,
  getService,
} from '../../services/remont';

const router = Router();

router.get('/reviews/', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);

    const { data } = await reviews(req.query, auth);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/work-autocomplete/:query', async (req, res, next) => {
  const { query } = req.params;
  try {
    const auth = getAuthHeaders(req);

    const { data } = await workAutocomplete(query, auth);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/reviews/:id', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const { id } = req.params;

    const { data } = await reviewsById(id, auth);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/car/brand/:typeId', async (req, res, next) => {
  const { typeId } = req.params;
  try {
    const auth = getAuthHeaders(req);

    const { data } = await carBrand(typeId, auth);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/car/model/:brandId', async (req, res, next) => {
  const { brandId } = req.params;
  try {
    const auth = getAuthHeaders(req);

    const { data } = await carModel(brandId, auth);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/car/generation/:modelId', async (req, res, next) => {
  const { modelId } = req.params;
  try {
    const auth = getAuthHeaders(req);

    const { data } = await carGeneration(modelId, auth);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/car/years/:modelId', async (req, res, next) => {
  const { modelId } = req.params;
  try {
    const auth = getAuthHeaders(req);

    const { data } = await carYears(modelId, auth);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/map/services/', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);

    const { data } = await mapServices(req.query, auth);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.post('/order/create/', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);

    const { data } = await orderCreate(req.body, auth);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.post('/user/', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);

    const { data } = await user(req.body, auth);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/user/:phone', async (req, res, next) => {
  const { phone } = req.params;
  try {
    const auth = getAuthHeaders(req);

    const { data } = await getUser(phone, auth);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/user/auto', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);

    const { data } = await getUserAuto(auth);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/orders/', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);

    const { data } = await orders(auth);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.post('/order/canceling', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);

    const { data } = await cancelOrder(req.body, auth);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.post('/order/edit', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);

    const { data } = await editOrder(req.body, auth);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.post('/map/search', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);

    const { data } = await mapSearch(req.body, auth);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/service/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const auth = getAuthHeaders(req);

    const { data } = await service(id, auth);
    res.json(data);
  } catch (e) {
    next(e);
  }
});
export default router;
