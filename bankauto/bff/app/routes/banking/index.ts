import { Router } from 'express';
import { getAdvertiseList, getBusinessRule, getSpecialOffer, getSpecialOffers } from '../../services/banking';

const router = Router();

router.get('/advertise/:count', async (req, res, next) => {
  try {
    const params = req.query;
    const { count } = req.params;
    const { data } = await getAdvertiseList(Number(count), params);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/special-offers', async (req, res, next) => {
  try {
    const params = req.query;
    const { data } = await getSpecialOffers(params);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/special-offers/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const { data } = await getSpecialOffer(id);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/business-rule/:vehicleId', async (req, res, next) => {
  const { vehicleId } = req.params;
  try {
    const { data } = await getBusinessRule(+vehicleId);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

export default router;
