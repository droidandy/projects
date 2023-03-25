import { DStorageLocalStoreAdapterTid, IDStorageLocalStoreAdapter } from '@invest.wl/domain';

export const SStorageLocalServiceTid = DStorageLocalStoreAdapterTid;
export const SStorageLocalConfigTid = Symbol.for('SStorageLocalConfigTid');

export interface ISStorageLocalConfig {
  // это нужно так как сторонние либы могут сохранять свои параметры в NSUserDefaults(ios), а clearAll не должен их стереть
  readonly prefix: string;
}

export interface ISStorageLocalService extends IDStorageLocalStoreAdapter {
}
