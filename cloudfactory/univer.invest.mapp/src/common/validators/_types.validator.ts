export type ValidatorFactory = (...args: any[]) => ValidatorFn;
export type ValidatorFn = (value: any) => ValidatorError | null;
export type ValidatorError = { [T in ValidatorType]?: any[] };

export type BaseValidatorType = string;
export type AnyValidatorType = BaseValidatorType | 'required';
export type NumericValidatorType = 'divisible' | 'minIPOSum' | AnyValidatorType;
export type StringValidatorType = 'length' | 'maxSequence' | 'maxSameSymbolsInARow' | 'notStartsWith' | AnyValidatorType;
export type ValidatorType = AnyValidatorType | NumericValidatorType | StringValidatorType;

type ErrorList = string[];
export interface InputWithError {
  errors?: ErrorList;
}
export type FormErrorList<T extends string> = { [K in T]?: ErrorList };
export type FormValidatorList<T extends string> = { [K in T]?: ValidatorFn[] };

export abstract class IFormWithErrors<T extends string> {
  public errors!: FormErrorList<T>;
}
