// @flow
import validate from 'validate.js';
import { email } from 'context/validations';

type SignInFormFields = {
  email?: string,
  password?: string
};

const validateSignInForm = (values: SignInFormFields): SignInFormFields => {
  const constrains = {
    email,
  };

  return validate(values, constrains, { fullMessages: false });
};

export default validateSignInForm;
