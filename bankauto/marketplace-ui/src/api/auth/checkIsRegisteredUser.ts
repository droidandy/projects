import API, { CancellableAxiosPromise } from 'api/request';
import { PersonalData } from 'types/CreditFormDataTypes';
import { RegistrationTypes } from 'types/Authentication';
import { LeadSourceInfo } from 'types/LeadSourceInfo';

function checkIsRegisteredUser(
  personalData: PersonalData,
  regType?: RegistrationTypes,
  meta?: LeadSourceInfo,
): CancellableAxiosPromise<{ userUuid: string; isPhoneVerified: boolean }> {
  return API.post('/user/registration/check-register-user', { ...personalData, regType, meta });
}

export { checkIsRegisteredUser };
