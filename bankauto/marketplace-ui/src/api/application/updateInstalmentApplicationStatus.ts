import API, { CancellableAxiosPromise } from 'api/request';
import { APPLICATION_INSTALMENT_STATUS } from '@marketplace/ui-kit/types';

interface InstallmentStatus {
  status: APPLICATION_INSTALMENT_STATUS;
}

function updateInstalmentApplicationStatus(
  id: string | number,
  params: InstallmentStatus,
): CancellableAxiosPromise<void> {
  return API.put(
    `/application/instalment/${id}/status`,
    {
      ...params,
    },
    {
      authRequired: true,
    },
  );
}

export { updateInstalmentApplicationStatus };
