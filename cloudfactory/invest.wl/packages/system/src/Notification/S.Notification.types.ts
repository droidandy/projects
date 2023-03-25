import { DNotificationStoreAdapterTid, IDNotificationStoreAdapter } from '@invest.wl/domain';

export const SNotificationStoreTid = DNotificationStoreAdapterTid;
export const SNotificationListenerTid = Symbol.for('SNotificationListenerTid');

export interface ISNotificationStore extends IDNotificationStoreAdapter {
}
