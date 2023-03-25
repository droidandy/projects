export interface IErrorDTO<C = number | string> extends Partial<Error> {
  code?: C;
  fn?: string;
  readonly signoutNeed?: boolean;
}

export interface IErrorExceptionDTO extends Error {
  isFatal?: boolean;
}

// отмена mobx.wait не является бизнесовой ошибкой
export const errorWhenCancelled = 'WHEN_CANCELLED';

export interface IErrorMessageMap<T> { [code: number]: (T extends object ? (e: T) => string | undefined : T); [status: string]: (T extends object ? (e: T) => string | undefined : T) }
