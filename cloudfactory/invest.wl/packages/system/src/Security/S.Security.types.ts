import { EDSecurityType } from '@invest.wl/core';
import { DSecurityServiceAdapterTid, DSecurityStoreAdapterTid, IDSecurityServiceAdapter, IDSecurityStoreAdapter } from '@invest.wl/domain';

export const SSecurityStoreTid = DSecurityStoreAdapterTid;
export const SSecurityServiceTid = DSecurityServiceAdapterTid;
export const SSecurityListenerTid = Symbol.for('SSecurityListenerTid');
export const SSecurityConfigTid = Symbol.for('SSecurityConfigTid');

export interface ISSecurityListener {
  init(): Promise<void>;
}

export interface ISSecurityStore extends IDSecurityStoreAdapter {
  accessSet(type: EDSecurityType, isAccessible?: boolean): Promise<void>;
  clear(): Promise<void>;
  lockedSet(locked: boolean): void;
}

export interface ISSecurityService extends IDSecurityServiceAdapter {
}

export interface ISSecurityConfig {
  readonly biometryAutoUnlock: boolean;
  readonly safeDisable: boolean;
  readonly deviceTrusted?: boolean;
}
