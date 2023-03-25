import { Router } from 'express';
import { getAuthHeaders } from '../../utils/authHelpers';
import {
  getOrderHoldUrl,
  getOrderHoldSignature,
  getOrderStatus,
  createOrder,
  debitOrderFunds,
  refundOrderFunds,
  transferOrderFundsToDealer,
} from '../../services/billing';

const router = Router();

router.get('/hold-url', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);

    const { data } = await getOrderHoldUrl(auth);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/signature/:id', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const { id } = req.params;

    const { data } = await getOrderHoldSignature(id, auth);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/status/:id', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const { id } = req.params;

    const { data } = await getOrderStatus(id, auth);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.post('/create', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const params = req.body;

    const { data } = await createOrder(params, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.post('/debit/:id', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const { id } = req.params;

    const { data } = await debitOrderFunds(id, {}, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.post('/refund/:id', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const { id } = req.params;

    const { data } = await refundOrderFunds(id, {}, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.post('/dealer-payment/:id', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const { id } = req.params;
    const params = req.body;

    const { data } = await transferOrderFundsToDealer(id, params, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

export default router;
