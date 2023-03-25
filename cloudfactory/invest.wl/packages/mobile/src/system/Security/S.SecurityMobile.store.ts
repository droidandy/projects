import { Injectable } from '@invest.wl/core';
import { SSecurityStore } from '@invest.wl/system';
import JailMonkey from 'jail-monkey';

@Injectable()
export class SSecurityMobileStore extends SSecurityStore {
  public get isDeviceTrusted() {
    return __DEV__ ? true : this._cfg.deviceTrusted || !JailMonkey.isJailBroken();
  }
}
