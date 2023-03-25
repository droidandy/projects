import { Inject, Injectable } from '@invest.wl/core';
import { DAuthAdapterTid, IDAuthAdapter } from './D.Auth.types';

@Injectable()
export class DAuthConfig {
  constructor(
    @Inject(DAuthAdapterTid) private _adapter: IDAuthAdapter,
  ) { }

  public get passwordMinLength() {
    return this._adapter.passwordMinLength;
  }

  public get passwordMaxLength() {
    return this._adapter.passwordMaxLength;
  }

  public get smsCodeLength() {
    return this._adapter.smsCodeLength;
  }

  public get smsCodeResendInterval() {
    return this._adapter.smsCodeResendInterval;
  }

  public get loginDefault() {
    return this._adapter.loginDefault;
  }

  public get passwordDefault() {
    return this._adapter.passwordDefault;
  }

  public get passwordChangeResend() {
    return this._adapter.passwordChangeResend;
  }
}
