import { IDStorageLocalDTO, TDStorageLocalValue } from '@invest.wl/core';

export const DStorageLocalStoreAdapterTid = Symbol.for('DStorageLocalStoreAdapterTid');

export interface IDStorageLocalStoreAdapter {
  getAll(): Promise<IDStorageLocalDTO>;
  get(key: string): Promise<string>;
  set(key: string, value: TDStorageLocalValue): Promise<void>;
  remove(...keys: string[]): Promise<void>;
}
