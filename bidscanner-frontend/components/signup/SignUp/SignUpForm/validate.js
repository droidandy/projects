// @flow
import validate from 'validate.js';
import { email } from 'context/validations';

type SignUpFormFields = {
  firstName?: string,
  lastName?: string,
  email?: string,
};

type SignUpFormErrors = {
  firstName?: string,
  lastName?: string,
  email?: string,
};

const validateSignUpForm = (values: SignUpFormFields): SignUpFormErrors => {
  const nameConstrains = {
    presence: { message: 'Required' },
    length: { maximum: 100, message: "Shouldn't be longer than 100 characters" },
  };

  const constrains = {
    email,
    firstName: nameConstrains,
    lastName: nameConstrains,
  };

  return validate(values, constrains, { fullMessages: false });
};

export default validateSignUpForm;
