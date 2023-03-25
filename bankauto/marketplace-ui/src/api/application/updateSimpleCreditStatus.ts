import API, { CancellableAxiosPromise } from 'api/request';
import { APPLICATION_CREDIT_STATUS, ApplicationCredit } from '@marketplace/ui-kit/types';

function updateSimpleCreditStatus(
  id: string | number,
  status: APPLICATION_CREDIT_STATUS,
): CancellableAxiosPromise<ApplicationCredit> {
  return API.put(
    `/application/simple-credit/${id}/status`,
    {
      status,
    },
    {
      authRequired: true,
    },
  );
}

export { updateSimpleCreditStatus };
