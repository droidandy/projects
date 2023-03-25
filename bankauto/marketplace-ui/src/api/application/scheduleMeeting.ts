import API, { CancellableAxiosPromise } from 'api/request';

function scheduleMeeting(id: string | number, date: number): CancellableAxiosPromise<void> {
  return API.post(
    `/application/vehicle/${id}/meeting/schedule`,
    {
      desired_date_time: date,
    },
    {
      authRequired: true,
    },
  );
}

function scheduleInstalmentMeeting(id: string | number, date: number): CancellableAxiosPromise<void> {
  return API.post(
    `/application/vehicle/instalment/${id}/meeting/schedule`,
    {
      desired_date_time: date,
    },
    {
      authRequired: true,
    },
  );
}

export { scheduleMeeting, scheduleInstalmentMeeting };
