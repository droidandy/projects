import { ValidatorFn } from './_types.validator';

const VALIDATOR_NAME = 'maxSameSymbolsInARow';

// Проверяет количество одинаковых символов подряд.
export function maxSameSymbolsInARowValidator(count: number): ValidatorFn {
  return (value: number | string) => {
    value = value.toString();
    // 0 одинаковых символов подряд, то же, что и 1 одинаковый символ подряд(т.е. вообще без повторений).
    if (value.length < count) { return null; }

    let inARow = 0;
    for (let i = 0; i <= value.length - 2; i++) {
      if (value[i] === value[i + 1]) {
        inARow++;
        if (inARow === count - 1) { return { [VALIDATOR_NAME]: [count] }; }
      } else {
        inARow = 0;
      }
    }

    return null;
  };
}
