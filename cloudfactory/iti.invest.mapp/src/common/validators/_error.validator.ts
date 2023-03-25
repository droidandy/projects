import { ValidatorFactory, ValidatorFn, ValidatorType } from './_types.validator';
import { divisibleValidator } from './divisible.validator';
import { lengthValidator } from './length.validator';
import { maxSameSymbolsInARowValidator } from './maxSameSymbolsInARow.validator';
import { maxSequenceValidator } from './maxSequence.validator';
import { minIPOSumValidator } from './minIPOSum.validator';
import { notStartsWithValidator } from './notStartsWith.validator';
import { requiredValidator } from './required.validator';

const VALIDATOR_ERROR_MESSAGE_MAP: { [T in ValidatorType]: (...args: any[]) => string } = {
  required: () => 'обязательно для заполнения',
  divisible: divider => `шаг цены ${divider}`,
  length: length => `количество знаков должно быть равно ${length}`,
  maxSequence: (result, length) => `последовательность из ${length} и более цифр недопустима`,
  maxSameSymbolsInARow: count => `использовать ${count} и более одинаковых символов подряд недопустимо`,
  notStartsWith: seq => `значение не должно начинаться с "${seq}"`,
  minIPOSum: seq => `минимальная сумма для участия в первичном размещении - ${seq}`,
};

export function makeErrorList(validators: ValidatorFn[], value: any, mutedValidators?: ValidatorType[]): string[] | undefined {
  const errors = Object.assign({}, ...validators.map(v => v(value)));
  const errorList = Object.keys(errors).map(
    (validatorName: ValidatorType) => mutedValidators && mutedValidators.includes(validatorName)
      ? null : VALIDATOR_ERROR_MESSAGE_MAP[validatorName](...errors[validatorName]),
  );

  return errorList.length ? errorList.filter((e: any) => e) : (undefined as any);
}

export const validatorList: { [T in ValidatorType]: ValidatorFactory } = {
  divisible: divisibleValidator,
  required: requiredValidator,
  length: lengthValidator,
  maxSameSymbolsInARow: maxSameSymbolsInARowValidator,
  maxSequence: maxSequenceValidator,
  notStartsWith: notStartsWithValidator,
  minIPOSum: minIPOSumValidator,
};
