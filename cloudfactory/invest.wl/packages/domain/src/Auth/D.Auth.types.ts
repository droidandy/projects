import {
  IDAuthConfirmRequestDTO,
  IDAuthConfirmResponseDTO,
  IDAuthCred,
  IDAuthExternalConfirmRequestDTO,
  IDAuthExternalConfirmResponseDTO,
  IDAuthExternalUrlRequestDTO,
  IDAuthExternalUrlResponseDTO,
  IDAuthExternalUrlSuccessRequestDTO,
  IDAuthExternalUrlSuccessResponseDTO,
  IDAuthPasswordChangeRequestDTO,
  IDAuthPasswordChangeResponseDTO,
  IDAuthPasswordCreateRequestDTO,
  IDAuthPasswordCreateResponseDTO,
  IDAuthPasswordRestoreRequestDTO,
  IDAuthPasswordRestoreResponseDTO,
  IDAuthRefreshRequestDTO,
  IDAuthRefreshResponseDTO,
  IDAuthRevokeRequestDTO,
  IDAuthRevokeResponseDTO,
  IDAuthSession,
  IDAuthSigninPrepareRequestDTO,
  IDAuthSigninPrepareResponseDTO,
  IDAuthSigninRequestDTO,
  IDAuthSigninResponseDTO,
  IDSecurityPayload,
} from '@invest.wl/core';

export const DAuthStoreTid = Symbol.for('DAuthStore');
export const DAuthConfigTid = Symbol.for('DAuthConfigTid');
export const DAuthServiceTid = Symbol.for('DAuthServiceTid');
export const DAuthGatewayTid = Symbol.for('DAuthGatewayTid');

export const DAuthAdapterTid = Symbol.for('DAuthAdapterTid');
export const DAuthStoreAdapterTid = Symbol.for('DAuthStoreAdapterTid');
export const DAuthServiceAdapterTid = Symbol.for('DAuthServiceAdapterTid');

export interface IDAuthStoreAdapter {
  readonly token?: string;
  readonly authenticated: boolean;
}

export interface IDAuthServiceAdapter {
  signIn(session: IDAuthSession, cred: IDAuthCred): Promise<void>;
  signOut(): Promise<void>;
  sessionRefresh(): Promise<IDAuthSession>;
  securityAccess(payload: IDSecurityPayload): Promise<void>;
  securityUnlock(payload: IDSecurityPayload): Promise<void>;
  securityLock(): Promise<void>;
}

export interface IDAuthAdapter {
  login(request: IDAuthSigninRequestDTO): Promise<IDAuthSigninResponseDTO>;
  refresh(request: IDAuthRefreshRequestDTO): Promise<IDAuthRefreshResponseDTO>;
  revoke(request: IDAuthRevokeRequestDTO): Promise<IDAuthRevokeResponseDTO>;
  loginConfirm(request: IDAuthConfirmRequestDTO): Promise<IDAuthConfirmResponseDTO>;
  loginPrepare(request: IDAuthSigninPrepareRequestDTO): Promise<IDAuthSigninPrepareResponseDTO>;
  passwordCreate(request: IDAuthPasswordCreateRequestDTO): Promise<IDAuthPasswordCreateResponseDTO>;
  passwordChange(request: IDAuthPasswordChangeRequestDTO): Promise<IDAuthPasswordChangeResponseDTO>;
  passwordRestore(request: IDAuthPasswordRestoreRequestDTO): Promise<IDAuthPasswordRestoreResponseDTO>;
  externalUrl(request: IDAuthExternalUrlRequestDTO): Promise<IDAuthExternalUrlResponseDTO>;
  externalUrlSuccess(request: IDAuthExternalUrlSuccessRequestDTO): Promise<IDAuthExternalUrlSuccessResponseDTO>;
  externalConfirm(request: IDAuthExternalConfirmRequestDTO): Promise<IDAuthExternalConfirmResponseDTO>;
  // config
  readonly passwordMinLength: number;
  readonly passwordMaxLength: number;
  readonly smsCodeLength: number;
  readonly smsCodeResendInterval: number;
  readonly loginDefault: string;
  readonly passwordDefault: string;
  readonly passwordChangeResend: number;
}
