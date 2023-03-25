import { Router } from 'express';
import VehicleRouter from './vehicle';
import VehiclesRouter from './vehicles';
import SellerRouter from './seller';
import FavouritesRouter from './favourites';
import ComparisonRouter from './comparison';
import Pdf from './pdf';
import ReviewRouter from './review';
import ExpocarRouter from './expocar';

const router = Router();
router.use('/vehicle', VehicleRouter);
router.use('/vehicles', VehiclesRouter);
router.use('/seller', SellerRouter);
router.use('/favourites', FavouritesRouter);
router.use('/pdf', Pdf);
router.use('/comparison', ComparisonRouter);
router.use('/review', ReviewRouter);
router.use('/expocar', ExpocarRouter);

export default router;
