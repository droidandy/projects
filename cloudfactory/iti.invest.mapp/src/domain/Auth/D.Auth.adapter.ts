import { Inject, Injectable } from '@invest.wl/core/src/di/IoC';
import {
  EDAuthExternalType, IDAuthConfirmRequestDTO, IDAuthConfirmResponseDTO, IDAuthExternalConfirmRequestDTO,
  IDAuthExternalConfirmResponseDTO, IDAuthExternalUrlRequestDTO, IDAuthExternalUrlResponseDTO,
  IDAuthExternalUrlSuccessRequestDTO, IDAuthExternalUrlSuccessResponseDTO, IDAuthPasswordChangeRequestDTO,
  IDAuthPasswordChangeResponseDTO, IDAuthPasswordCreateRequestDTO, IDAuthPasswordCreateResponseDTO,
  IDAuthPasswordRestoreRequestDTO, IDAuthPasswordRestoreResponseDTO, IDAuthRefreshRequestDTO, IDAuthRefreshResponseDTO,
  IDAuthRevokeRequestDTO, IDAuthRevokeResponseDTO, IDAuthSigninPrepareRequestDTO, IDAuthSigninPrepareResponseDTO,
  IDAuthSigninRequestDTO, IDAuthSigninResponseDTO,
} from '@invest.wl/core/src/dto/Auth';
import { STransportAuthService } from '@invest.wl/system/src/Transport/Auth/S.TransportAuth.service';
import { IDAuthAdapter } from '@invest.wl/domain/src/Auth/D.Auth.types';
import { ISConfigStore, SConfigStoreTid } from '@invest.wl/system/src/Config/S.Config.types';
import { STransportAuthServiceTid } from '@invest.wl/system/src/Transport/S.Transport.types';
import { ISErrorService, SErrorServiceTid } from '@invest.wl/system/src/Error/S.Error.types';
import { DDateUtil } from '@invest.wl/domain/src/Date/D.Date.util';

@Injectable()
export class DAuthAdapter implements IDAuthAdapter {
  constructor(
    @Inject(STransportAuthServiceTid) private _tp: STransportAuthService,
    @Inject(SConfigStoreTid) private _cfg: ISConfigStore,
    @Inject(SErrorServiceTid) private _errorService: ISErrorService,
  ) {}

  public login(req: IDAuthSigninRequestDTO): Promise<IDAuthSigninResponseDTO> {
    return this._tp.Login(req);
  }

  public refresh(req: IDAuthRefreshRequestDTO): Promise<IDAuthRefreshResponseDTO> {
    return this._tp.Refresh(req);
  }

  public loginConfirm(req: IDAuthConfirmRequestDTO): Promise<IDAuthConfirmResponseDTO> {
    return this._tp.AuthorizeConfirm({ code: req.code });
  }

  public loginPrepare(req: IDAuthSigninPrepareRequestDTO): Promise<IDAuthSigninPrepareResponseDTO> {
    return this._tp.AuthorizeLoginPrepare(req);
  }

  public passwordChange(req: IDAuthPasswordChangeRequestDTO): Promise<IDAuthPasswordChangeResponseDTO> {
    return this._tp.AuthorizePasswordChange({ newPassword: req.password, oldPassword: req.passwordOld });
  }

  public passwordRestore(req: IDAuthPasswordRestoreRequestDTO): Promise<IDAuthPasswordRestoreResponseDTO> {
    throw new Error('not implemented');
  }

  public passwordCreate(req: IDAuthPasswordCreateRequestDTO): Promise<IDAuthPasswordCreateResponseDTO> {
    throw new Error('not implemented');
  }

  public revoke(req: IDAuthRevokeRequestDTO): Promise<IDAuthRevokeResponseDTO> {
    return this._tp.Revoke(req);
  }

  public async externalUrl(req: IDAuthExternalUrlRequestDTO): Promise<IDAuthExternalUrlResponseDTO> {
    const url = req.type === EDAuthExternalType.Keycloak ? this._cfg.authExternalUrlKeycloak : '';
    if (!url) throw this._errorService.systemHandle('No external URL');
    return { url };
  }

  public async externalUrlSuccess(req: IDAuthExternalUrlSuccessRequestDTO): Promise<IDAuthExternalUrlSuccessResponseDTO> {
    const url = req.type === EDAuthExternalType.Keycloak ? this._cfg.authExternalUrlSuccessKeycloak : '';
    if (!url) throw this._errorService.systemHandle('No external success URL');
    return { url };
  }

  public externalConfirm(req: IDAuthExternalConfirmRequestDTO): Promise<IDAuthExternalConfirmResponseDTO> {
    if (req.type === EDAuthExternalType.Keycloak) {
      return this._tp.LoginKeycloak({ code: req.code }).then(res => ({
        accessToken: res.access_token, refreshToken: res.refresh_token,
        expiresIn: new Date(Date.now() + (res.expires_in * DDateUtil.SECOND)),
        refreshExpiresIn: new Date(Date.now() + (res.refresh_expires_in * DDateUtil.SECOND)),
      }));
    } else {
      throw this._errorService.systemHandle('No external confirm for ESIA');
    }
  }

  public get passwordMinLength() {
    return this._cfg.authPasswordMinLength;
  }

  public get passwordMaxLength() {
    return this._cfg.authPasswordMaxLength;
  }

  public get smsCodeLength() {
    return this._cfg.authSmsCodeLength;
  }

  public get smsCodeResendInterval() {
    return this._cfg.authSmsCodeResendInterval;
  }

  public get loginDefault() {
    return this._cfg.authLoginDefault;
  }

  public get passwordDefault() {
    return this._cfg.authPasswordDefault;
  }

  public get passwordChangeResend() {
    return this._cfg.authPasswordChangeResend;
  }
}
