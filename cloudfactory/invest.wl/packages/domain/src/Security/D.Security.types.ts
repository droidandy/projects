import { EDSecurityBiometryType, IDSecurityPayload } from '@invest.wl/core';

export const DSecurityStoreTid = Symbol.for('DSecurityStoreTid');
export const DSecurityStoreAdapterTid = Symbol.for('DSecurityStoreAdapterTid');
export const DSecurityServiceTid = Symbol.for('DSecurityServiceTid');
export const DSecurityServiceAdapterTid = Symbol.for('DSecurityServiceAdapterTid');
export const DSecurityAdapterTid = Symbol.for('DSecurityAdapterTid');

export interface IDSecurityAdapter {
  // config
  readonly codeLength: number;
  readonly codeDefault: string;
  readonly timeoutToLock: number;
}

export interface IDSecurityStoreAdapter {
  readonly codeAccessed: boolean;
  readonly biometryAccessed: boolean;
  readonly isDeviceTrusted: boolean;
  biometryType?: EDSecurityBiometryType;
  // закрыто ли хранилище для RW
  readonly locked: boolean;
  readonly biometryAutoUnlock: boolean;
  readonly safeDisable: boolean;
  readonly unlockCan: boolean;
  init(): Promise<void>;
}

export interface IDSecurityServiceAdapter {
  dataSave(data: string): Promise<void>;
  dataGet(payload: IDSecurityPayload): Promise<string | undefined>;
  read(): Promise<string | undefined>;
  lock(): Promise<void>;
  check(payload: IDSecurityPayload): Promise<void>;
  unlock(payload: IDSecurityPayload): Promise<void>;
  unlockCancel(payload: IDSecurityPayload): Promise<void>;
  accessRequestAndDataSave(payload: IDSecurityPayload, data: string): Promise<void>;
  accessRequest(payload: IDSecurityPayload): Promise<void>;
  accessRevoke(payload: IDSecurityPayload): Promise<void>;
  clean(): Promise<void>;
}
