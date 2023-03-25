import { ValidatorFn, ValidatorType } from './_types.validator';

const VALIDATOR_NAME: ValidatorType = 'divisible';

export function divisibleValidator(divider: number): ValidatorFn {
  return (value: any) => {
    // во избежание случаев когда js может вместо целого вернуть x.999999998
    return !Number.isFinite(value) || value < divider ||
      parseFloat((value / divider).toFixed(4)) !== Math.round(value / divider)
      ? { [VALIDATOR_NAME]: [divider] } : null;
  };
}
