import { EDAuthStrategy, IDAuthCred, IDAuthSession, IDSecurityPayload } from '@invest.wl/core';
import { DAuthServiceAdapterTid, DAuthStoreAdapterTid, IDAuthServiceAdapter, IDAuthStoreAdapter } from '@invest.wl/domain';

export const SAuthStoreTid = DAuthStoreAdapterTid;
export const SAuthServiceTid = DAuthServiceAdapterTid;
export const SAuthSecurityStrategyTid = Symbol.for('SAuthSecurityStrategyTid');
export const SAuthConfigTid = Symbol.for('SAuthConfigTid');
export const SAuthListenerTid = Symbol.for('SAuthListenerTid');

export interface ISAuthStore extends IDAuthStoreAdapter {
  readonly token?: string;
  readonly refreshToken?: string;
  readonly refreshNeed: boolean;
  sessionSet(session?: IDAuthSession): void;
}

export interface ISAuthListener {
  init(): Promise<void>;
}

export interface ISAuthConfig {
  strategy: EDAuthStrategy;
}

export interface ISAuthService extends IDAuthServiceAdapter {
}

export interface ISAuthSecurityStrategy {
  onSignIn(session: IDAuthSession, cred: IDAuthCred): Promise<void>;
  onAccess(payload: IDSecurityPayload): Promise<void>;
  onUnlock(payload: IDSecurityPayload): Promise<void>;
  onLock(): Promise<void>;

  sessionRefreshBySecurity(payload: IDSecurityPayload): Promise<void>;
  sessionRefresh(refreshToken: string): Promise<IDAuthSession>;
}
