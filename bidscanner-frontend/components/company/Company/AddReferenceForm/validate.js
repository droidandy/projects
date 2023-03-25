// @flow
import validate from 'validate.js';

const validateForm = values => {
  const constrains = {
    projectName: {
      presence: { message: 'Required' },
    },
    description: {
      presence: { message: 'Required' },
    },
    country: {
      presence: { message: 'Required' },
    },
    year: {
      presence: { message: 'Required' },
    },
  };

  return validate(values, constrains, { fullMessages: false });
};

export default validateForm;
