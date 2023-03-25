// @flow
import { isValidNumber } from 'libphonenumber-js';

const validateForm = ({ address, phone }) => {
  let errors = {};

  if (!address.asString) {
    errors = {
      ...errors,
      address: 'Should be filled',
    };
  }

  if (!phone) {
    errors = {
      ...errors,
      phone: 'Should be filled',
    };
  }

  if (!isValidNumber(phone)) {
    errors = {
      ...errors,
      phone: 'Should be valid',
    };
  }
  return errors;
};

export default validateForm;
