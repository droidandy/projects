import { EDStorageLocalKey, Inject, Injectable } from '@invest.wl/core';
import { DAuthStore, DAuthStoreTid, DSecurityStore, DSecurityStoreTid, DStorageLocalStore, DStorageLocalStoreTid } from '@invest.wl/domain';
import { ISHardwareBackConfig, ISHardwareBackStore, ISRouterStore, SHardwareBackConfigTid, SHardwareBackStoreTid, SRouterStoreTid } from '@invest.wl/system';
import { reaction } from 'mobx';
import { EVAuthScreen } from '../Auth/V.Auth.types';
import { EVLayoutScreen } from '../Layout/V.Layout.types';
import { EVSecurityScreen } from '../Security/V.Security.types';
import { EVRouterScreen, IVRouterNested, IVRouterParams, IVRouterService, VRouterServiceTid } from './V.Router.types';

export interface IVRouteInitial {
  screen: EVRouterScreen;
  params?: IVRouterNested & IVRouterParams;
}

@Injectable()
export class VRouterListener {
  private _isAppStarted = false;

  constructor(
    @Inject(DStorageLocalStoreTid) private slStore: DStorageLocalStore,
    @Inject(DAuthStoreTid) private authStore: DAuthStore,
    @Inject(DSecurityStoreTid) private securityStore: DSecurityStore,
    @Inject(VRouterServiceTid) private routerService: IVRouterService,
    @Inject(SRouterStoreTid) private routerStore: ISRouterStore,
    @Inject(SHardwareBackStoreTid) private hbStore: ISHardwareBackStore,
    @Inject(SHardwareBackConfigTid) private hbCfg: ISHardwareBackConfig,
  ) { }

  public async init() {
    const screenBeforeExit = this.hbCfg.screenBeforeExit as EVRouterScreen;
    if (screenBeforeExit) {
      this.hbStore.onPressX.subscribe(e => {
        if (e?.appExit && this.routerStore.isActive[EVLayoutScreen.LayoutMain] && !this.routerStore.isActive[screenBeforeExit]) {
          e.appExit = false;
          this.routerService.navigateTo(screenBeforeExit);
        }
      });
    }

    reaction(() => this.securityStore.unlockCan, async unlockCan => {
      if (!unlockCan) {
        if (this.routerStore.isActive[EVAuthScreen.AuthSignin]) return;
        await this._onAuthChange({ screen: EVAuthScreen.AuthSignin });
      }
    }, { delay: 1 });
    reaction(() => this.authStore.authenticated, async authenticated => {
      if (!authenticated) this._onAuthChange({ screen: EVAuthScreen.AuthSignin });
    }, { delay: 1 });
  }

  public onAppStart(route: IVRouteInitial) {
    if (this._isAppStarted) {
      // сюда попадаем только если приложение было "закрыто", но не выгруженно из памяти (при нажатии системной кнопки "назад")
      // стэк навигатора тоже обнуляется, поэтому нам надо почистить и текуший стэк
      this.routerStore.stackSet([]);
      this._onAuthChange(route);
    } else {
      this._isAppStarted = true;
      route = this._manualCheck() || this._authCheck() || route;

      // for rapid screen switch
      if (__DEV__) {
        // route = {
        //   screen: EVInstrumentScreen.Instrument,
        //   params: { cid: new DInstrumentId({ 'classCode': 'SPBXM', 'id': '48249', 'secureCode': 'RIG' }) },
        // };
        // route = { screen: EVPlaygroundScreen.Playground };
      }
      this._navigateTo(route);
    }
  }

  private _onAuthChange(route?: IVRouteInitial) {
    route = this._authCheck() || route;
    this._navigateTo(route);
  }

  // Если пользователь не видел экран Manual - перейти на экран Manual
  private _manualCheck(): IVRouteInitial | undefined {
    const manualSeen = this.slStore.get(EDStorageLocalKey.LayoutManualSeen);
    return manualSeen !== 'true' ? { screen: EVLayoutScreen.LayoutManual } : undefined;
  }

  private _authCheck(): IVRouteInitial | undefined {
    if (this.authStore.authenticated) return { screen: EVLayoutScreen.LayoutMain };
    else if (this.securityStore.unlockCan) return { screen: EVSecurityScreen.SecurityUnlock };
    else return;
  }

  private _navigateTo(route?: IVRouteInitial) {
    if (route) {
      if (route.screen === EVSecurityScreen.SecurityUnlock && !this.routerStore.isActive[EVSecurityScreen.SecurityUnlock]) {
        this.routerService.navigateTo(route.screen);
      } else {
        this.routerService.resetTo(route.screen, route.params);
      }
    }
  }
}
