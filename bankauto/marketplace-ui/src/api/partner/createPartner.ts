import API, { CancellableAxiosPromise } from 'api/request';
import { Partner } from 'types/Partner';

function createPartner(values: Partner): CancellableAxiosPromise<void> {
  const { name, email, phone, comment } = values;
  return API.post(
    '/lead/connect',
    {
      city_id: values.cityId,
      company_type: values.companyType,
      company_name: values.companyName,
      name,
      email,
      phone,
      comment,
    },
    {},
  );
}

export { createPartner };
