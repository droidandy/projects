import { bindState } from 'react-form-base';

export function bindModalState(component, key = 'form') {
  return {
    ...bindState(component, key),
    visible: Boolean(component.state && component.state[`${key}Visible`])
  };
}

export function paymentCardValidations(inputNames) {
  const [monthInputName, yearInputName] = inputNames.split('/');

  return {
    [monthInputName]: {
      presence: true,
      numericality: { onlyInteger: true, greaterThanOrEqualTo: 1, lessThanOrEqualTo: 12 },
      cardExpiration: { yearInputName }
    },
    [yearInputName]: {
      presence: true,
      numericality: true,
      cardExpiration: { monthInputName }
    }
  };
}
