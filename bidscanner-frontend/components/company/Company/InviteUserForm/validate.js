// @flow
import validate from 'validate.js';

const validateForm = values => {
  const constrains = {
    email: {
      presence: { message: 'Required' },
      email: { message: 'Please enter a valid email' },
    },
  };

  return validate(values, constrains, { fullMessages: false });
};

export default validateForm;
