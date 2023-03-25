import { IDAuthCred, IDAuthSession } from '@invest.wl/core';

export const STransportConfigTid = Symbol.for('STransportConfigTid');
export const STransportAuthServiceTid = Symbol.for('STransportAuthServiceTid');

export interface ISTransportConfig {
  configEndpointUid: string;
}

export interface ISTransportAuthTwoFactorService {
  Refresh(request: Required<Pick<IDAuthSession, 'refreshToken'>>): Promise<IDAuthSession>;
}

export interface ISTransportAuthSimpleService {
  Login(request: IDAuthCred): Promise<IDAuthSession>;
}
