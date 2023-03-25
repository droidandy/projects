import API, { CancellableAxiosPromise } from 'api/request';

import { CompanyType } from 'types/CompanyType';

function getCompanyTypes(): CancellableAxiosPromise<CompanyType[]> {
  return API.get<CompanyType[]>('/lead/company-types');
}

export { getCompanyTypes };
