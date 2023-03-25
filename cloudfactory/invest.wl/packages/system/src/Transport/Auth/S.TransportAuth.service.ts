import { decodeCrypto, encodeCrypto, passwordToHash } from '@invest.wl/common';
import { EDAuthPasswordHash, IDAuthCred, IDAuthSession, Inject, Injectable } from '@invest.wl/core';
import { DDateUtil } from '@invest.wl/domain';
import { ISConfigStore, SConfigStoreTid } from '../../Config/S.Config.types';
import { ISErrorService, SErrorServiceTid } from '../../Error/S.Error.types';
import {
  ESNetworkHttpMethod,
  ISNetworkEndpointProvider,
  ISNetworkHttpClient,
  SNetworkEndpointProviderTid,
  SNetworkHttpClientTid,
} from '../../Network/S.Network.types';
import { ISTransportAuthSimpleService, ISTransportAuthTwoFactorService } from '../S.Transport.types';
import {
  IPostAuthorizeConfirmRequest,
  IPostAuthorizeConfirmResponse,
  IPostAuthorizePrepareRequest,
  IPostAuthorizePrepareResponse,
  IPostRefreshRequest,
  IPostRefreshResponse,
  IPostRevokeRequest,
  IPostRevokeResponse,
} from './model';
import { GetLoginKeycloakRequest, GetLoginKeycloakResponse } from './model/GetLoginKeycloak';
import { IPostAuthorizeLoginPrepareRequest, IPostAuthorizeLoginPrepareResponse } from './model/PostAuthorizeLoginPrepare';
import { IPostAuthorizePasswordChangeRequest, IPostAuthorizePasswordChangeResponse } from './model/PostAuthorizePasswordChange';
import { IPostLoginRequest, IPostLoginResponse } from './model/PostLogin';

type TNoSession<T> = Omit<T, 'authorizationRequestId' | 'eKey' | 'passwordHashType' | 'passwordSalt'>;

@Injectable()
export class STransportAuthService implements ISTransportAuthTwoFactorService, ISTransportAuthSimpleService {
  public static _passwordCryptify(password: string, hashType: EDAuthPasswordHash, salt: string, eKey: string) {
    const hashedPassword = passwordToHash(hashType, password, salt);
    return encodeCrypto(hashedPassword, eKey);
  }

  private _authorizationRequestId?: string;
  private _passwordExtra?: IPostAuthorizeLoginPrepareResponse;

  private get _isRshb() {
    return this._cfg.systemConfigUrl?.includes('rshb');
  }

  constructor(
    @Inject(SNetworkHttpClientTid) private _httpClient: ISNetworkHttpClient,
    @Inject(SNetworkEndpointProviderTid) private _epPrv: ISNetworkEndpointProvider,
    @Inject(SConfigStoreTid) private _cfg: ISConfigStore,
    @Inject(SErrorServiceTid) private _errorService: ISErrorService,
  ) { }

  public async Login(request: IDAuthCred): Promise<IDAuthSession> {
    const ep = this._epPrv.provide('token');
    return this._httpClient.request<IPostLoginRequest, IPostLoginResponse>(ep, {
      username: request.login, password: request.password, client_id: 'eftr-service', grant_type: 'password',
    }, undefined, {
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    }).then(res => ({ accessToken: res.access_token, refreshToken: res.refresh_token }));
  }

  public async Refresh(request: Required<Pick<IDAuthSession, 'refreshToken'>>): Promise<IDAuthSession> {
    const ep = this._epPrv.provide('refresh');
    let promise: Promise<any>;
    if (this._isRshb) {
      promise = this._httpClient.request<Pick<IDAuthSession, 'refreshToken'>, IDAuthSession>(ep, request);
    } else {
      promise = this._httpClient.request<IPostRefreshRequest, IPostRefreshResponse>(ep, {
        refresh_token: request.refreshToken, grant_type: 'refresh_token', client_id: 'eftr-service',
      }, undefined, { headers: { 'content-type': 'application/x-www-form-urlencoded' } })
        .then(res => ({
          accessToken: res.access_token, refreshToken: res.refresh_token,
          expiresIn: new Date(Date.now() + (res.expires_in * DDateUtil.SECOND)),
          refreshExpiresIn: new Date(Date.now() + (res.refresh_expires_in * DDateUtil.SECOND)),
        }));
      // return this._httpClient.request<IPostRefreshRequest, IPostRefreshResponse>(ep, { refresh_token: decodeCrypto(request.refreshToken, this._authStore.token!) })
      //   .then(res => ({ refreshToken: res.refresh_token, accessToken: res.access_token }));
    }
    return promise;
  }

  public async AuthorizeConfirm(request: TNoSession<IPostAuthorizeConfirmRequest>): Promise<IPostAuthorizeConfirmResponse> {
    const ep = this._epPrv.provide('053ddbc0');
    if (!this._authorizationRequestId) throw new Error('No session data');
    return this._httpClient.request<IPostAuthorizeConfirmRequest, IPostAuthorizeConfirmResponse>(ep, {
      ...request, authorizationRequestId: this._authorizationRequestId,
    }).then(res => !this._isRshb ? res : {
      // для RSHB надо декодировать рефрэш токен
      accessToken: res.accessToken, refreshToken: decodeCrypto(res.refreshToken, res.accessToken),
    });
  }

  public async AuthorizeLoginPrepare(request: TNoSession<IPostAuthorizeLoginPrepareRequest & Pick<IPostAuthorizePrepareRequest, 'password'>>): Promise<IPostAuthorizePrepareResponse> {
    const ep = this._epPrv.provide('feb85b44');
    const res = await this._httpClient.request<IPostAuthorizeLoginPrepareRequest, IPostAuthorizeLoginPrepareResponse>(ep, request);
    this._passwordExtra = res;
    return this.AuthorizePrepare(request);
  }

  public async AuthorizePasswordChange(request: TNoSession<IPostAuthorizePasswordChangeRequest>): Promise<IPostAuthorizePasswordChangeResponse> {
    const ep = this._epPrv.provide('f82442c6');
    if (!this._authorizationRequestId || !this._passwordExtra) throw new Error('No session data');
    return this._httpClient.request<IPostAuthorizePasswordChangeRequest, IPostAuthorizePasswordChangeResponse>(ep, {
      ...request, authorizationRequestId: this._authorizationRequestId, eKey: this._passwordExtra.eKey,
    });
  }

  public async AuthorizePrepare(request: TNoSession<IPostAuthorizePrepareRequest>): Promise<IPostAuthorizePrepareResponse> {
    const ep = this._epPrv.provide('4e9291ff');
    if (!this._passwordExtra) throw new Error('No session data');
    const { passwordHashType, passwordSalt, eKey } = this._passwordExtra;
    const password = STransportAuthService._passwordCryptify(request.password, passwordHashType, passwordSalt, eKey);
    const res = await this._httpClient.request<IPostAuthorizePrepareRequest, IPostAuthorizePrepareResponse>(ep, {
      login: request.login, password, eKey,
    });
    this._authorizationRequestId = res.authorizationRequestId;
    return res;
  }

  public async Revoke(request: TNoSession<IPostRevokeRequest>): Promise<IPostRevokeResponse> {
    const ep = this._epPrv.provide('936b487e');
    return this._httpClient.request<IPostRevokeRequest, IPostRevokeResponse>(ep, request);
  }

  public LoginKeycloak(request: Pick<GetLoginKeycloakRequest, 'code'>): Promise<GetLoginKeycloakResponse> {
    const url = this._cfg.authExternalUrlConfirmKeycloak;
    if (!url) throw this._errorService.systemHandle('No keycloak url');
    return this._httpClient.request<GetLoginKeycloakRequest, GetLoginKeycloakResponse>({
      url, method: ESNetworkHttpMethod.POST,
    }, { ...request, grant_type: 'authorization_code', client_id: 'eftr-service' }, undefined, {
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    });
  }
}
