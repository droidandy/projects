import { ILambda, TModelDTO } from '@invest.wl/common';

export type TDInputValue = string | undefined;

export interface IDInputModelProps {
  validatorList?: ILambda<((...args: any) => string | undefined)[] | undefined>;
}

export interface IDInputModel<V = TDInputValue> {
  /**
   * Сырое значение.
   */
  readonly value?: V;
  /**
   * Набор ошибок валидации.
   */
  readonly errors?: string[];
  /**
   * Набор ошибок встроенной валидации.
   */
  readonly errorsValidator?: string;
  /**
   * Признак валидности поля. По-умолчанию: true, если errors === undefined.
   */
  readonly isValid: boolean;
  /**
   * Признак недоступности к изменению значения
   */
  readonly isDisabled: boolean;
  /**
   * Является ли значение лямбдой
   */
  readonly isLambda: boolean;
  /**
   * Установлено какое либо значение (лямбда возвращающая undefined = notEmpty)
   */
  readonly isEmpty: boolean;

  /**
   * Задать значение поля или расчётную функцию, в которой можно через замыкание парсить inputValue поля.
   * Для того чтобы можно было прокинуть значение в домене не отвязываясь от VInput - передаем чистое значение, НЕ лямбду
   * @param value
   */
  valueSet(value?: ILambda<V | undefined>): this;
  /**
   * Задать набор ошибок поля или расчётную функцию, в которой можно через замыкание валидировать inputValue или value поля.
   * @param errors
   */
  errorsSet(errors: ILambda<string | string[] | undefined>): this;
  /**
   * Задать значение валидности поля или расчётную функцию, в которой можно через замыкание проверять errors, inputValue, value и тд.
   * @param valid
   */
  validSet(valid: ILambda<boolean>): this;
  disabledSet(disabled: ILambda<boolean>): this;
}

export type IDInputFormFields<O extends object> = {
  [K in keyof Required<O>]: O[K] extends Date ? IDInputModel<Date> : O[K] extends (infer A)[]
    ? (A extends Date ? IDInputModel<Date> : (A extends object ? IDInputFormFields<A>[] : IDInputModel<A>[]))
    : O[K] extends object ? IDInputFormFields<O[K]> : IDInputModel<O[K]>
};

export interface IDInputFormModel<DTO extends TModelDTO> {
  readonly fields: IDInputFormFields<DTO>;
  readonly isValid: boolean;
  readonly asDTO: DTO;
  fromDTO(dto?: DTO): this;
  clear(): void;
}
