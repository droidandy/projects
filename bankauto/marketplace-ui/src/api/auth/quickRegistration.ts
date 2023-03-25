import API, { CancellableAxiosPromise } from 'api/request';
import { clearLeadSourceCookie, enrichWithLeadSourceMeta } from 'helpers/cookies';

function quickRegistration(
  firstName: string,
  lastName: string,
  middleName: string,
  phone: string,
): CancellableAxiosPromise<void> {
  return API.post('/user/registration/quick', {
    ...enrichWithLeadSourceMeta({
      firstName,
      lastName,
      middleName,
      phone,
    }),
    clientId: process.env.CLIENT_ID,
  }).then((res) => {
    clearLeadSourceCookie();
    return res;
  });
}

export { quickRegistration };
