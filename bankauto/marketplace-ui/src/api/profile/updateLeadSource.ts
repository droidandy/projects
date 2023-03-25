import API, { CancellableAxiosPromise } from 'api/request';
import { LeadSourceInfo } from 'types/LeadSourceInfo';

function updateLeadSource(leadInfo: LeadSourceInfo): CancellableAxiosPromise<void> {
  return API.post(
    '/user/lead-source/update',
    {
      ...leadInfo,
    },
    {
      authRequired: true,
    },
  );
}

export { updateLeadSource };
