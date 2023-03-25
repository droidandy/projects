import { Inject, Injectable } from '@invest.wl/core';
import { ISErrorService, ISStorageLocalConfig, ISStorageLocalService, SErrorServiceTid, SStorageLocalConfigTid } from '@invest.wl/system';
import DefaultPreference from 'react-native-default-preference';

// не секретные (не шифруемые) локальные настройки приложения
@Injectable()
export class SStorageLocalMobileService implements ISStorageLocalService {
  constructor(
    @Inject(SErrorServiceTid) private _errorService: ISErrorService,
    @Inject(SStorageLocalConfigTid) private _cfg: ISStorageLocalConfig,
  ) {}

  public async getAll() {
    const all = await DefaultPreference.getAll()
      .catch((e: any) => {throw this._errorService.systemHandle(e); });
    const result: any = {};
    for (const key in all) {
      if (all.hasOwnProperty(key) && key.indexOf(this._cfg.prefix) === 0) {
        result[key.substr(this._cfg.prefix.length)] = all[key];
      }
    }
    return result;
  }

  public get(key: string): Promise<string> {
    return DefaultPreference.get(this._keyWithPrefix(key))
      .catch((e: any) => {throw this._errorService.systemHandle(e); });
  }

  public set(key: string, value: string) {
    return DefaultPreference.set(this._keyWithPrefix(key), value)
      .catch((e: any) => {throw this._errorService.systemHandle(e); });
  }

  public async remove(...keys: string[]) {
    await Promise.all(keys.map(this._clear))
      .catch((e: any) => {throw this._errorService.systemHandle(e); });
  }

  private _clear = (key: string) => DefaultPreference.clear(this._keyWithPrefix(key));
  private _keyWithPrefix = (key: string) => this._cfg.prefix + key;
}

