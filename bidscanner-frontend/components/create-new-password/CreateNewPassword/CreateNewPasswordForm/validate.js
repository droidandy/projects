// @flow
import validate from 'validate.js';
import { password, confirmPassword } from 'context/validations';

type EnterNewPasswordFormFields = {
  password?: string,
  confirmPassword?: string
};

const validateCreateNewPasswordForm = (values: EnterNewPasswordFormFields) => {
  const constrains = {
    password,
    confirmPassword,
  };

  return validate(values, constrains, { fullMessages: false });
};

export default validateCreateNewPasswordForm;
