import { EDApplicationState } from '@invest.wl/core';

export const DApplicationConfigTid = Symbol.for('DApplicationConfigTid');
export const DApplicationStoreTid = Symbol.for('DApplicationStoreTid');
export const DApplicationStoreAdapterTid = Symbol.for('DVersionStoreAdapterTid');
export const DApplicationAdapterTid = Symbol.for('DApplicationAdapterTid');

export interface IDApplicationStoreAdapter {
  state: EDApplicationState;
  // Приложение в состоянии выполнения полезной работы пользователем: активно, авторизовано, не заблокировано, api достурно.
  readonly isUseful: boolean;
  // В фоне, но позволяет выполнять действия (пулинг данных).
  readonly isUsefulBg: boolean;
  readonly needUpdate: boolean;
  readonly isNewVersion: boolean;
  init(): Promise<void>;
}

export interface IDApplicationAdapter {
  // config
  readonly name: string;
  readonly buildDate: string;
  readonly versionInfo: string;
  readonly versionBuild: string;
  readonly versionBuildRevision: string;
  readonly versionAdviser: string;
  readonly versionTarget: string;
}
