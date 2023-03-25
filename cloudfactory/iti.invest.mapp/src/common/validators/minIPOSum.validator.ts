import { ValidatorFn } from './_types.validator';

const VALIDATOR_NAME = 'minIPOSum';

export function minIPOSumValidator(minSum: number, minSumWithCode: string): ValidatorFn {
  return (value: any) => value < minSum ? { [VALIDATOR_NAME]: [minSumWithCode] } : null;
}
