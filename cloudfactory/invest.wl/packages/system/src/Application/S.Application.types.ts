import { DApplicationStoreAdapterTid, IDApplicationStoreAdapter } from '@invest.wl/domain';

export const SApplicationStoreTid = DApplicationStoreAdapterTid;
export const SApplicationListenerTid = Symbol.for('SApplicationListenerTid');

export interface ISApplicationStore extends IDApplicationStoreAdapter {}

export interface ISApplicationListener {
  init(): Promise<void>;
  dispose(): void;
}
