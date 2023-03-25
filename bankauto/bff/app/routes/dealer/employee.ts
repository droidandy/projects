import { Router } from 'express';
import { getAuthHeaders } from '../../utils/authHelpers';
import {
  createEmployee,
  deleteEmployeeBrand,
  deleteEmployeeOffice,
  fireEmployee,
  getEmployee,
  getEmployeeBrands,
  getEmployeeOffices,
  getEmployees,
  hireEmployee,
  setEmployeeBrand,
  setEmployeeOffice,
  updateEmployee,
} from '../../services/dealerEmployee';

const router = Router();

router.get('/list', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);

    const { data } = await getEmployees(auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/item/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const auth = getAuthHeaders(req);

    const { data } = await getEmployee(id, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.post('/item', async (req, res, next) => {
  try {
    const params = req.body;
    const auth = getAuthHeaders(req);

    const { data } = await createEmployee(auth, params);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.put('/item/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const params = req.body;
    const auth = getAuthHeaders(req);

    const { data } = await updateEmployee(auth, id, params);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.put('/item/:id/fire', async (req, res, next) => {
  try {
    const { id } = req.params;
    const auth = getAuthHeaders(req);

    const { data } = await fireEmployee(auth, id);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.put('/item/:id/hire', async (req, res, next) => {
  try {
    const { id } = req.params;
    const auth = getAuthHeaders(req);

    const { data } = await hireEmployee(auth, id);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.put('/item/:id/brand', async (req, res, next) => {
  try {
    const { id } = req.params;
    const params = req.body;
    const auth = getAuthHeaders(req);

    const { data } = await setEmployeeBrand(auth, id, params);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.delete('/item/:id/brand', async (req, res, next) => {
  try {
    const { id } = req.params;
    const params = req.body;
    const auth = getAuthHeaders(req);

    const { data } = await deleteEmployeeBrand(auth, id, params);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/item/:id/brand/list', async (req, res, next) => {
  try {
    const { id } = req.params;
    const auth = getAuthHeaders(req);

    const { data } = await getEmployeeBrands(auth, id);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.put('/item/:id/office', async (req, res, next) => {
  try {
    const { id } = req.params;
    const params = req.body;
    const auth = getAuthHeaders(req);

    const { data } = await setEmployeeOffice(auth, id, params);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.delete('/item/:id/office', async (req, res, next) => {
  try {
    const { id } = req.params;
    const params = req.body;
    const auth = getAuthHeaders(req);

    const { data } = await deleteEmployeeOffice(auth, id, params);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/item/:id/office/list', async (req, res, next) => {
  try {
    const { id } = req.params;
    const auth = getAuthHeaders(req);

    const { data } = await getEmployeeOffices(auth, id);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

export default router;
