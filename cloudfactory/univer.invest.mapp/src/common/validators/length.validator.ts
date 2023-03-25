import { ValidatorFn } from './_types.validator';

const VALIDATOR_NAME = 'length';

export function lengthValidator(length: number): ValidatorFn {
  return (value: any) => {
    return !value || value.length !== length ? { [VALIDATOR_NAME]: [length] } : null;
  };
}
