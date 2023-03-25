// @flow
import validate from 'validate.js';
import { email } from 'context/validations';

type RequestNewPasswordFormFields = {
  email?: string
};

const validateRequestNewPasswordForm = (
  values: RequestNewPasswordFormFields
): RequestNewPasswordFormFields => {
  const constrains = {
    email,
  };

  return validate(values, constrains, { fullMessages: false });
};

export default validateRequestNewPasswordForm;
