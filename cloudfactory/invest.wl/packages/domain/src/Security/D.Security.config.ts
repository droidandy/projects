import { Inject, Injectable } from '@invest.wl/core';
import { DSecurityAdapterTid, IDSecurityAdapter } from './D.Security.types';

export const DSecurityConfigTid = Symbol.for('DSecurityConfigTid');

@Injectable()
export class DSecurityConfig {
  public get codeLength() {
    return this._adapter.codeLength;
  }

  public get codeDefault() {
    return this._adapter.codeDefault;
  }

  public get timeoutToLock() {
    return this._adapter.timeoutToLock;
  }

  constructor(
    @Inject(DSecurityAdapterTid) private _adapter: IDSecurityAdapter,
  ) {}
}
