import { Router } from 'express';
import { Application } from '@marketplace/ui-kit/types';
import { getAuthHeaders } from '../../utils/authHelpers';
import { getApplication, getApplications } from '../../services/application';
import { getDealerVehicle, getDealerVehicles } from '../../services/dealerVehicle';

const router = Router();

router.get('/list', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);

    const { data: applicationsData } = await getApplications(req.query, auth);
    const ids = applicationsData.map((app) => app.vehicle?.vehicleId).filter((id) => !!id) as number[];
    const { data: vehicleData } = await getDealerVehicles({ ids }, auth);
    const applications: Application[] = applicationsData.reduce((result, item) => {
      return item.vehicle
        ? [
            ...result,
            {
              ...item,
              vehicle: item.vehicle,
              vehicleData: vehicleData.find((i) => item.vehicle && +i.id === +item.vehicle.vehicleId),
            },
          ]
        : result;
    }, [] as Application[]);
    res.json(applications);
  } catch (e) {
    next(e);
  }
});

router.get('/item/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const auth = getAuthHeaders(req);

    const { data: applicationData } = await getApplication(id, auth);

    if (applicationData.vehicle?.vehicleId) {
      const { data: vehicleData } = await getDealerVehicle(auth, id);
      res.json({ ...applicationData, vehicleData });
    }

    res.json(applicationData);
  } catch (e) {
    next(e);
  }
});

export default router;
