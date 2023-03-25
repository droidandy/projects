import { Injectable } from '@invest.wl/core';
import { ISStorageLocalConfig } from '@invest.wl/system/src/StorageLocal/S.StorageLocal.types';

@Injectable()
export class SStorageLocalConfig implements ISStorageLocalConfig {
  public prefix = '@invest.wl:';
}
