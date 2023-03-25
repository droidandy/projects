import router from '../vehicle';
import { getAutotekaReportLink } from '../../services/autoteka';

router.get('/report/:vehicleId', async (req, res, next) => {
  try {
    const { vehicleId } = req.params;
    const { data } = await getAutotekaReportLink(vehicleId);
    res.json(data);
  } catch (e) {
    next(e);
  }
});
export default router;
