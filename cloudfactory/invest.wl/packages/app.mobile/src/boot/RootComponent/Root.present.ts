import { Inject, Injectable, IoC } from '@invest.wl/core';
import { DErrorService, DErrorServiceTid } from '@invest.wl/domain/src/Error/D.Error.service';
import { DSecurityStore } from '@invest.wl/domain/src/Security/D.Security.store';
import { DSecurityStoreTid } from '@invest.wl/domain/src/Security/D.Security.types';
import { action, makeObservable, observable, runInAction } from 'mobx';
import SplashScreen from 'react-native-splash-screen';
import { initRN2CrashliticBridge } from '../initRN2CrashliticBridge';

export const RootPresentTid = Symbol.for('RootPresentTid');

export interface IRootPresent {
  readonly isDeviceTrusted: boolean;
  readonly isLoading: boolean;
  readonly isLoadingError: boolean;
  readonly isReadyForRenderApp: boolean;
  init(): Promise<void>;
  onAppReady(): void;
  load(): Promise<void>;
}

@Injectable()
export class RootPresent implements IRootPresent {
  @observable public isLoading = true;
  @observable public isLoadingError = false;
  @observable public isReadyForRenderApp = false;

  constructor(
    @Inject(DErrorServiceTid) private _errorService: DErrorService,
    @Inject(DSecurityStoreTid) private _securityStore: DSecurityStore,
  ) {
    makeObservable(this);
  }

  public get isDeviceTrusted() {
    return this._securityStore.isDeviceTrusted;
  }

  public async init() {
    try {
      SplashScreen.hide();
      initRN2CrashliticBridge();
      await this.load();
    } catch (error: any) {
      // TODO: Повтор в этой фазе не имеет смысла, нужно выйти из приложения
      // нужно ли показывать скрин с ошибкой и какой?
      console.error(`Failed to bootstrap _preload: ${error.message}`, { error });
      throw this._errorService.progHandle(error);
    }
  }

  @action.bound
  public onAppReady() {
    this.isLoading = false;
  }

  @action
  public async load() {
    if (!this.isDeviceTrusted) return;
    this.isLoading = true;
    this.isLoadingError = false;

    try {
      await IoC.init();
      runInAction(() => (this.isReadyForRenderApp = true));
    } catch (error: any) {
      if (__DEV__) console.log(error);
      runInAction(() => (this.isLoadingError = true));
    }
  }
}
