import { EDSecurityType, Inject, Injectable } from '@invest.wl/core';
import { DAuthStoreTid, IDAuthStoreAdapter } from '@invest.wl/domain/src/Auth/D.Auth.types';
import { DSecurityService } from '@invest.wl/domain/src/Security/D.Security.service';
import { DSecurityServiceTid } from '@invest.wl/domain/src/Security/D.Security.types';
import { ISConfigStore, SConfigStoreTid } from '@invest.wl/system/src/Config/S.Config.types';
import { ISNetworkStore, SNetworkStoreTid } from '@invest.wl/system/src/Network/S.Network.types';
import { ISRouterService, SRouterServiceTid } from '@invest.wl/system/src/Router/S.Router.types';
import { EVLayoutScreen } from '@invest.wl/view/src/Layout/V.Layout.types';
import { reaction } from 'mobx';
import { SDebugService } from '../S.Debug.service';
import { SDebugServiceTid } from '../S.Debug.types';

export const SDebugLoginCommandTid = Symbol.for('SDebugLoginCommandTid');

@Injectable()
export class SDebugLoginCommand {
  constructor(
    @Inject(SDebugServiceTid) private _debugService: SDebugService,
    @Inject(DSecurityServiceTid) private _securityService: DSecurityService,
    @Inject(DAuthStoreTid) private _authStore: IDAuthStoreAdapter,
    @Inject(SRouterServiceTid) private _router: ISRouterService,
    @Inject(SNetworkStoreTid) private _networkStore: ISNetworkStore,
    @Inject(SConfigStoreTid) private _cfg: ISConfigStore,
  ) {
  }

  public init() {
    reaction(
      () => ({
        authenticated: this._authStore.authenticated,
        isSessionExpired: this._networkStore.isUnauthorized,
      }),
      ({ authenticated, isSessionExpired }) => {
        const ok = authenticated && !isSessionExpired;
        this._debugService.dispose();
        if (!ok) {
          this._debugService.add('Restore Login', this._performRestoreLogin);
        }
      }, { fireImmediately: true });
  }

  private _performRestoreLogin = async () => {
    try {
      await this._securityService.unlock({ by: EDSecurityType.CODE, text: this._cfg.securityCodeDefault });
      this._router.resetTo(EVLayoutScreen.LayoutMain);
    } catch (error: any) {
      console.log('SDebugLoginCommand _performRestoreLogin failed', { error, m: error.message }); // 🐞 ✅
    }
  };
}
