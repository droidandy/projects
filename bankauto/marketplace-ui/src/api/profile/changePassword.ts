import API, { CancellableAxiosPromise } from 'api/request';
import { PasswordResetData } from 'types/PasswordResetData';
import { passwordChangeMapper } from 'api/mappers';

function changePassword({
  password,
  passwordConfirm,
  currentPassword,
}: PasswordResetData): CancellableAxiosPromise<void> {
  return API.post(
    '/user/password/change',
    {
      current_password: currentPassword,
      password,
      password_confirm: passwordConfirm,
    },
    {
      authRequired: true,
    },
  ).catch(passwordChangeMapper);
}

export { changePassword };
