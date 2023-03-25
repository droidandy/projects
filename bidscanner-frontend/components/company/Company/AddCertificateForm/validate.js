// @flow
import validate from 'validate.js';

const validateForm = values => {
  const constrains = {
    institution: {
      presence: { message: 'Required' },
    },
    certification: {
      presence: { message: 'Required' },
    },
    issueDate: {
      presence: { message: 'Required' },
    },
    expiryDate: {
      presence: { message: 'Required' },
    },
    number: {
      presence: { message: 'Required' },
    },
    files: {
      presence: { message: 'Required' },
    },
  };

  return validate(values, constrains, { fullMessages: false });
};

export default validateForm;
