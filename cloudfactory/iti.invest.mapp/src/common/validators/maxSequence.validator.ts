import { ValidatorFn } from './_types.validator';

const VALIDATOR_NAME = 'maxSequence';

// Проверяет на наличие прямых и обратных последовательностей, состоящие более чем из length цифр
export function maxSequenceValidator(length: number): ValidatorFn {
  return (value: number | string) => {
    value = value.toString();
    if (value.length < length) { return null; }

    let result = 0;
    let direction = 0; // направление, возрастание (1) или убывание (-1)
    for (let i = 0; i < value.length - 2; i++) {
      const v = parseInt(value[i], 10) - parseInt(value[i + 1], 10);
      if (Math.abs(v) === 1 && (direction ? v === direction : true)) {
        direction = v;
        result++;
        if (result === length - 1) { break; }
      } else {
        direction = 0;
        result = 0;
      }
    }

    return result === length - 1 ? { [VALIDATOR_NAME]: [result, length] } : null;
  };
}
