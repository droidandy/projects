import {
  IDAuthConfirmRequestDTO,
  IDAuthConfirmResponseDTO,
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
  IDAuthSigninPrepareRequestDTO,
  IDAuthSigninPrepareResponseDTO,
  IDAuthSigninRequestDTO,
  IDAuthSigninResponseDTO,
  Inject,
  Injectable,
} from '@invest.wl/core';
import { DAuthAdapterTid, IDAuthAdapter } from './D.Auth.types';

@Injectable()
export class DAuthGateway {
  constructor(
    @Inject(DAuthAdapterTid) private adapter: IDAuthAdapter,
  ) {}

  public login(request: IDAuthSigninRequestDTO): Promise<IDAuthSigninResponseDTO> {
    return this.adapter.login(request);
  }

  public loginPrepare(request: IDAuthSigninPrepareRequestDTO): Promise<IDAuthSigninPrepareResponseDTO> {
    return this.adapter.loginPrepare(request);
  }

  public loginConfirm(request: IDAuthConfirmRequestDTO): Promise<IDAuthConfirmResponseDTO> {
    return this.adapter.loginConfirm(request);
  }

  public passwordChange(request: IDAuthPasswordChangeRequestDTO): Promise<IDAuthPasswordChangeResponseDTO> {
    return this.adapter.passwordChange(request);
  }

  public passwordCreate(request: IDAuthPasswordCreateRequestDTO): Promise<IDAuthPasswordCreateResponseDTO> {
    return this.adapter.passwordCreate(request);
  }

  public passwordRestore(request: IDAuthPasswordRestoreRequestDTO): Promise<IDAuthPasswordRestoreResponseDTO> {
    return this.adapter.passwordRestore(request);
  }

  public refresh(request: IDAuthRefreshRequestDTO): Promise<IDAuthRefreshResponseDTO> {
    return this.adapter.refresh(request);
  }

  public async revoke(request: IDAuthRevokeRequestDTO): Promise<IDAuthRevokeResponseDTO> {
    return this.adapter.revoke(request);
  }

  public externalUrl(req: IDAuthExternalUrlRequestDTO): Promise<IDAuthExternalUrlResponseDTO> {
    return this.adapter.externalUrl(req);
  }

  public externalUrlSuccess(req: IDAuthExternalUrlSuccessRequestDTO): Promise<IDAuthExternalUrlSuccessResponseDTO> {
    return this.adapter.externalUrlSuccess(req);
  }

  public externalConfirm(req: IDAuthExternalConfirmRequestDTO): Promise<IDAuthExternalConfirmResponseDTO> {
    return this.adapter.externalConfirm(req);
  }
}
