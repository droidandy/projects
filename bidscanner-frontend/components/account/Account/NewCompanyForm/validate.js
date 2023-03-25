// @flow
import validate from 'validate.js';

const validateForm = values => {
  const constrains = {
    name: {
      presence: { message: 'Required' },
      length: { maximum: 100, message: "Shouldn't be longer than 100 characters" },
    },
    website: {
      presence: { message: 'Required' },
      length: { maximum: 100, message: "Shouldn't be longer than 100 characters" },
      url: {
        message: 'Please, use the valid url',
      },
    },
    companyType: {
      presence: { message: 'Required' },
    },
    legalBusinessType: {
      presence: { message: 'Required' },
    },
    logo: {
      presence: { message: 'Required' },
    },
  };

  const { address } = values;
  if (!address) {
    return {
      ...validate(values, constrains, { fullMessages: false }),
      address: 'Required',
    };
  }

  if (address && address.asString && !address.asObject) {
    return {
      ...validate(values, constrains, { fullMessages: false }),
      address: 'Please, pick your address from the dropdown',
    };
  }

  return validate(values, constrains, { fullMessages: false });
};

export default validateForm;
