import { ToggleX } from '@invest.wl/common';
import { Inject, Injectable } from '@invest.wl/core';
import { DSecurityConfig, DSecurityConfigTid, DSecurityUnlockCase, DSecurityUnlockCaseTid, IDSecurityUnlockCaseProps } from '@invest.wl/domain';
import { ISRouterStore, SHardwareBackHolder, SRouterStoreTid } from '@invest.wl/system';
import { action, computed, makeObservable, observable } from 'mobx';
import { EVLayoutScreen } from '../../Layout/V.Layout.types';
import { IVRouterService, VRouterServiceTid } from '../../Router/V.Router.types';

export const VSecurityUnlockPresentTid = Symbol.for('VSecurityUnlockPresentTid');

export interface IVSecurityUnlockPresentProps extends IDSecurityUnlockCaseProps {
}

@Injectable()
export class VSecurityUnlockPresent {
  @observable.ref public props?: IVSecurityUnlockPresentProps;

  public biometryToggle = new ToggleX();
  public backHolder = new SHardwareBackHolder({ native: true });

  constructor(
    @Inject(DSecurityUnlockCaseTid) public cse: DSecurityUnlockCase,
    @Inject(VRouterServiceTid) private _router: IVRouterService,
    @Inject(DSecurityConfigTid) private _cfg: DSecurityConfig,
    @Inject(SRouterStoreTid) private _sRouterStore: ISRouterStore,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IVSecurityUnlockPresentProps) {
    this.props = props;
    this.cse.init(props);
    if (this.cse.isBiometryAutoUnlock) {
      this.biometryUnlock().then();
    }
    this.backHolder.subscribe(e => {
      e!.goBack = false;
      e!.appExit = true;
    });
  }

  public dispose() {
    this.backHolder.dispose();
  }

  @computed
  public get authPinCodeLength() {
    return this._cfg.codeLength;
  }

  public codeUnlock = async (code: string) => {
    await this.cse.codeUnlock(code);
    this._onSuccess();
  };

  public biometryUnlock = async () => {
    try {
      this.biometryToggle.open();
      await this.cse.biometryUnlock();
      this.biometryToggle.close();
      this._onSuccess();
    } finally {
      this.biometryToggle.close();
    }
  };

  public biometryClose = async () => {
    this.biometryToggle.close();
    await this.cse.biometryUnlockCancel();
  };

  private _onSuccess() {
    if (this._router.canGoBack() && !!this._sRouterStore.stackPrev.length && !this._sRouterStore.stackPrev.includes(EVLayoutScreen.LayoutLaunch)) {
      this._router.back();
    } else {
      this._router.resetTo(EVLayoutScreen.LayoutMain);
    }
  }
}
