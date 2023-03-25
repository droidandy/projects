// @flow
import validate from 'validate.js';

type GenerateItemFormFields = {
  price?: string
};

const validateGenerateItemForm = (values: GenerateItemFormFields): GenerateItemFormFields => {
  const constrains = {
    price: {
      numericality: {
        onlyInteger: true,
        greaterThan: 0,
        lessThanOrEqualTo: 99999999,
        message: 'Must be an integer number.',
      },
      presence: { message: 'This field is required' },
    },
  };

  return validate(values, constrains, { fullMessages: false });
};

export default validateGenerateItemForm;
