import { Router } from 'express';
import VehicleRouter from './vehicle';
import OfficeRouter from './office';
import EmployeeRouter from './employee';
import PartnersRouter from './partners';

const router = Router();

router.use('/vehicle', VehicleRouter);
router.use('/office', OfficeRouter);
router.use('/employee', EmployeeRouter);
router.use('/partner', PartnersRouter);

export default router;
