import API, { CancellableAxiosPromise } from 'api/request';

interface VehicleStatus {
  status: string;
}

function updateApplicationVehicleStatus(id: string | number, params: VehicleStatus): CancellableAxiosPromise<void> {
  return API.put(
    `/application/vehicle/${id}/status`,
    {
      ...params,
    },
    {
      authRequired: true,
    },
  );
}

export { updateApplicationVehicleStatus };
