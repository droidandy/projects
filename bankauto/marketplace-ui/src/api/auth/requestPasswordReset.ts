import API, { CancellableAxiosPromise } from 'api/request';
import { Token } from '@marketplace/ui-kit/types';
import { ForgotPasswordFieldType } from 'types/ForgotPasswordFieldType';

const RESET_THROUGH_MAP = {
  [ForgotPasswordFieldType.EMAIL]: 'email',
  [ForgotPasswordFieldType.PHONE]: 'phone',
};

function requestPasswordReset(
  fieldType: ForgotPasswordFieldType,
  resetThroughValue: string,
): CancellableAxiosPromise<Token> {
  return API.post('/user/request-reset/any', {
    [RESET_THROUGH_MAP[fieldType]]: resetThroughValue,
  });
}

export { requestPasswordReset };
