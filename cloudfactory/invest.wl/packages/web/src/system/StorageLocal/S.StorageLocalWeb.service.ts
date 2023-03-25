import {
  ISStorageLocalConfig, ISStorageLocalService, SStorageLocalConfigTid,
} from '@invest.wl/system/src/StorageLocal/S.StorageLocal.types';
import { Inject, Injectable } from '@invest.wl/core/src/di/IoC';
import { ISErrorService, SErrorServiceTid } from '@invest.wl/system/src/Error/S.Error.types';

// не секретные (не шифруемые) локальные настройки приложения
@Injectable()
export class SStorageLocalWebService implements ISStorageLocalService {
  constructor(
    @Inject(SErrorServiceTid) private _errorService: ISErrorService,
    @Inject(SStorageLocalConfigTid) private _cfg: ISStorageLocalConfig,
  ) {}

  public async get<V>(key: string) {
    try {
      return (localStorage.getItem(this._keyWithPrefix(key)) || '');
    } catch (e: any) {
      throw this._errorService.systemHandle(e);
    }
  }

  public async set(key: string, value: string) {
    try {
      return localStorage.setItem(this._keyWithPrefix(key), value);
    } catch (e: any) {
      throw this._errorService.systemHandle(e);
    }
  }

  public async remove(...keys: string[]) {
    await Promise.all(keys.map(this._clear))
      .catch((e: any) => {throw this._errorService.systemHandle(e); });
  }

  public async getAll() {
    const all = localStorage;
    const result: any = {};
    for (const key in all) {
      if (all.hasOwnProperty(key) && key.indexOf(this._cfg.prefix) === 0) {
        result[key.substr(this._cfg.prefix.length)] = all[key];
      }
    }
    return result;
  }

  private _clear = (key: string) => localStorage.removeItem(this._keyWithPrefix(key));
  private _keyWithPrefix = (key: string) => this._cfg.prefix + key;
}

