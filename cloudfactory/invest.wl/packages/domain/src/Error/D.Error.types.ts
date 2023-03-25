import { EventX, IErrorModel } from '@invest.wl/common';

export enum EDErrorBusinessCode {
  NotLoaded,
  FormNotValid,
  OrderCreateConfirmFailed,
  OrderCreateCanceled
}

export enum EDErrorProgCode {
  NotInitialized,
}

export const DErrorServiceAdapterTid = Symbol.for('DErrorServiceAdapterTid');
export const DErrorStoreAdapterTid = Symbol.for('DErrorStoreAdapterTid');

export interface IDErrorStoreAdapter {
  readonly errorX: EventX<IErrorModel>;
  init(): Promise<void>;
  add(error: IErrorModel): void;
}

export interface IDErrorServiceAdapter {
  handle<E extends IErrorModel>(error: E): E;
}

