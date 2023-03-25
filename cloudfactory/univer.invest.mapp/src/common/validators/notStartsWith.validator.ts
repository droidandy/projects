import { ValidatorFn } from './_types.validator';

const VALIDATOR_NAME = 'notStartsWith';

// Проверяет, начинается ли строка с одной из запрещенных последовательностей.
export function notStartsWithValidator(sequences: string[]): ValidatorFn {
  return (value: any) => {
    if (!sequences) { return null; }

    for (const seq of sequences) {
      if (value.startsWith(seq)) {
        return { [VALIDATOR_NAME]: [seq] };
      }
    }

    return null;
  };
}
