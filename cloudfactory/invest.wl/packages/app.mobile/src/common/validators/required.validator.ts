import { ValidatorFn } from './_types.validator';

const VALIDATOR_NAME = 'required';

function required(value: any) {
  return !value && value !== 0 ? { [VALIDATOR_NAME]: [] } : null;
}

export function requiredValidator(): ValidatorFn {
  return required;
}
