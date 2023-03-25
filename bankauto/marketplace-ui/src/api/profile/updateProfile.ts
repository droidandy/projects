import API, { CancellableAxiosPromise } from 'api/request';
import { User } from '@marketplace/ui-kit/types';
import { ProfileMainInfoFormData } from 'types/ProfileMainInfoFormData';

function updateProfile(values: ProfileMainInfoFormData): CancellableAxiosPromise<User> {
  return API.put(
    '/user/profile',
    {
      first_name: values.firstName,
      last_name: values.lastName,
      patronymic_name: values.patronymicName,
      gender: values.gender,
      email: values.email,
      city_id: values.cityId,
    },
    {
      authRequired: true,
    },
  );
}

export { updateProfile };
