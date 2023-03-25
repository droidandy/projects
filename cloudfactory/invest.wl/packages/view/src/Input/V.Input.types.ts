import { TModelDTO } from '@invest.wl/common';
import { IDInputFormModel } from '@invest.wl/domain';
import { IVInputModel } from './model/V.Input.model';

export type IVInputFormFields<O extends object> = {
  [K in keyof Required<O>]: O[K] extends Date ? IVInputModel<string> : O[K] extends (infer A)[]
    ? (A extends Date ? IVInputModel<string> : (A extends object ? IVInputFormFields<A>[] : IVInputModel<A>[]))
    : (O[K] extends object ? IVInputFormFields<O[K]> : IVInputModel<any>)
    // : (O[K] extends object ? IVInputFormFields<O[K]> : IVInputModel<O[K]>)
};

export interface IVInputFormModel<M extends IDInputFormModel<any>, DTO extends TModelDTO = M['asDTO']> {
  readonly domain: M;
  readonly isValid: boolean;
  readonly fields: IVInputFormFields<DTO>;
  reset(): void;
  dirtySet(dirty?: boolean): void;
}
