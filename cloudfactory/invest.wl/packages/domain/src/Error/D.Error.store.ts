import { IErrorModel } from '@invest.wl/common';
import { Inject, Injectable } from '@invest.wl/core';
import { DErrorStoreAdapterTid, IDErrorStoreAdapter } from './D.Error.types';

export const DErrorStoreTid = Symbol.for('DErrorStore');

@Injectable()
export class DErrorStore {
  public get errorX() {
    return this._store.errorX;
  }

  constructor(
    @Inject(DErrorStoreAdapterTid) private _store: IDErrorStoreAdapter,
  ) {}

  public add(e: IErrorModel) {
    this._store.add(e);
  }
}
