import { IErrorModel } from '@invest.wl/common';
import { EDApplicationState, Inject, Injectable, IPromiseCb } from '@invest.wl/core';
import { reaction, when } from 'mobx';
import { ISApplicationStore, SApplicationStoreTid } from '../Application/S.Application.types';
import { ISConfigStore, SConfigStoreTid } from '../Config/S.Config.types';
import { SErrorHttpModel } from '../Error/model/S.ErrorHttp.model';
import { SErrorSecurityModel } from '../Error/model/S.ErrorSecurity.model';
import { SErrorSystemModel } from '../Error/model/S.ErrorSystem.model';
import { ISErrorStore, SErrorStoreTid } from '../Error/S.Error.types';
import { SNetworkAccessRefreshServiceTid } from '../Network/S.Network.types';
import { SNetworkAccessRefreshService } from '../Network/S.NetworkAccessRefresh.service';
import { ISAuthListener, ISAuthService, ISAuthStore, SAuthServiceTid, SAuthStoreTid } from './S.Auth.types';

@Injectable()
export class SAuthListener implements ISAuthListener {
  private _timeInactive?: number;

  constructor(
    @Inject(SErrorStoreTid) protected _errorStore: ISErrorStore,
    @Inject(SApplicationStoreTid) private _appStore: ISApplicationStore,
    @Inject(SConfigStoreTid) private _cfg: ISConfigStore,
    @Inject(SNetworkAccessRefreshServiceTid) private _networkAccessRefreshService: SNetworkAccessRefreshService,
    @Inject(SAuthStoreTid) private _authStore: ISAuthStore,
    @Inject(SAuthServiceTid) private _authService: ISAuthService,
  ) { }

  public async init() {
    if (this._appStore.isNewVersion) await this._authService.signOut();
    this._errorStore.errorX.subscribe(this._onError);
    reaction(() => this._appStore.state, this._onAppStateChange);
    reaction(() => this._networkAccessRefreshService.resolver, this._onNetworkAccessResolver);
  }

  // Network
  private _onNetworkAccessResolver = async (resolver?: IPromiseCb<string>) => {
    if (!resolver) return;
    if (!this._lockNeedOnAppStateChange && this._authStore.refreshToken) {
      this._authService.sessionRefresh().then(res => resolver.resolve(res.accessToken)).catch(resolver.reject);
    } else {
      when(() => !!this._authStore.token && this._appStore.state === EDApplicationState.active,
        () => resolver.resolve(this._authStore.token));
    }
  };

  // Application
  public _onAppStateChange = (stateNext: EDApplicationState) => {
    if (stateNext === EDApplicationState.background) this._onAppBackground();
    else if (stateNext === EDApplicationState.active) this._onAppActive();
  };

  private _onAppBackground() {
    this._timeInactive = Date.now();
  }

  private _onAppActive() {
    if (this._lockNeedOnAppStateChange) this._authService.securityLock().then();
    this._timeInactive = undefined;
  }

  private get _lockNeedOnAppStateChange() {
    return !!this._timeInactive && (Date.now() - this._timeInactive > this._cfg.securityTimeoutToLock);
  }

  // Error
  private _onError = (e?: IErrorModel) => {
    if ((e instanceof SErrorSecurityModel || e instanceof SErrorHttpModel || e instanceof SErrorSystemModel)
      && e.signoutNeed) this._authService.signOut().then();
  };
}
