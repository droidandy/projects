import { Router } from 'express';
import { getAuthHeaders } from '../../utils/authHelpers';
import {
  getOffice,
  getOfficeBrands,
  getOfficeOrganizations,
  getOfficePhones,
  getOffices,
  getOfficesCount,
} from '../../services/dealerOffice';

const router = Router();

router.get('/list', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);

    const { data } = await getOffices(auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/count', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);

    const { data } = await getOfficesCount(auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/item/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const auth = getAuthHeaders(req);

    const { data } = await getOffice(id, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/item/:id/phones', async (req, res, next) => {
  try {
    const { id } = req.params;
    const auth = getAuthHeaders(req);

    const { data } = await getOfficePhones(id, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/item/:id/organizations', async (req, res, next) => {
  try {
    const { id } = req.params;
    const auth = getAuthHeaders(req);

    const { data } = await getOfficeOrganizations(id, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/item/:id/brands', async (req, res, next) => {
  try {
    const { id } = req.params;
    const auth = getAuthHeaders(req);

    const { data } = await getOfficeBrands(id, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

export default router;
