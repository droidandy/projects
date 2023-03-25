// @flow
import validate from 'validate.js';
import { email } from 'context/validations';

type SubscriptionFormFields = {
  email?: string,
};

type SignUpFormErrors = {
  email?: string,
};

const validateSignUpForm = (values: SubscriptionFormFields): SignUpFormErrors => {
  const constrains = {
    email,
  };

  return validate(values, constrains, { fullMessages: false });
};

export default validateSignUpForm;
