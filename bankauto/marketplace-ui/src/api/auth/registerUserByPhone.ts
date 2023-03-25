import API, { CancellableAxiosPromise } from 'api/request';
import { clearLeadSourceCookie, enrichWithLeadSourceMeta } from 'helpers/cookies';
import { RegistrationTypes } from 'types/Authentication';

function registerUserByPhone(
  name: string,
  email: string,
  cityId: number,
  consentTo: number,
  regType?: RegistrationTypes,
): CancellableAxiosPromise<{ uuid: string }> {
  return API.post(
    '/user/registration/phone',
    enrichWithLeadSourceMeta({
      name,
      email,
      cityId,
      consentTo,
      regType,
    }),
    {
      authRequired: true,
    },
  ).then((res) => {
    clearLeadSourceCookie();
    return res;
  });
}

export { registerUserByPhone };
