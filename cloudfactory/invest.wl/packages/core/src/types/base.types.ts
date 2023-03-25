export type TDurationISO8601 = string;
export type TModelId = string;
export type TObject<C = any> = Record<string, any> & { context?: C };

export interface TFunction<T extends (...args: any) => any = (...args: any) => any> {

}

export enum EBool {
  False = 0,
  True = 1,
}

// interface to type
export type Typify<T> = { [K in keyof T]: T[K] extends object ? Typify<T[K]> : T[K] };

export interface IApiResponse<D, S = number> {
  code: S;
  message?: string;
  // в случае ошибки data = undefined
  data: D;
}

export interface IPromiseCb<Res = any, Err = any> {
  resolve(value?: Res | PromiseLike<Res>): void;
  reject(value?: Err): void;
}

export interface IAreaPoint {
  x: number;
  y: number;
}
