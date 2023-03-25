import { EDSecurityType, IDSecurityPayload, Inject, Injectable } from '@invest.wl/core';
import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { DAuthService } from '../../Auth/D.Auth.service';
import { DAuthServiceTid } from '../../Auth/D.Auth.types';
import { DSecurityService } from '../D.Security.service';
import { DSecurityStore } from '../D.Security.store';
import { DSecurityServiceTid, DSecurityStoreTid } from '../D.Security.types';
import { DSecuritySettingCase, DSecuritySettingCaseTid } from './D.SecuritySetting.case';

export const DSecurityUnlockCaseTid = Symbol.for('DSecurityUnlockCaseTid');

export interface IDSecurityUnlockCaseProps {
  unlockAutoDisabled?: boolean;
  biometryText: string;
}

@Injectable()
export class DSecurityUnlockCase {
  @observable.ref public props?: IDSecurityUnlockCaseProps;
  @observable public isBusy = false;

  @computed
  public get isBiometryAutoUnlock() {
    return this.biometryEnabled && this._securityStore.biometryAutoUnlock && !this.props?.unlockAutoDisabled;
  }

  @computed
  public get biometryType() {
    return this._securityStore.biometryType;
  }

  @computed
  public get biometryEnabled() {
    return this._settingCase.authSigninByBio;
  }

  constructor(
    @Inject(DSecuritySettingCaseTid) private _settingCase: DSecuritySettingCase,
    @Inject(DSecurityServiceTid) private _securityService: DSecurityService,
    @Inject(DSecurityStoreTid) private _securityStore: DSecurityStore,
    @Inject(DAuthServiceTid) private _authService: DAuthService,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IDSecurityUnlockCaseProps) {
    this.props = props;
  }

  public biometryUnlock = () =>
    this.unlock({ by: EDSecurityType.BIO, text: this.props?.biometryText ?? '' });

  public biometryUnlockCancel = () =>
    this._securityService.unlockCancel({ by: EDSecurityType.BIO, text: '' });

  public codeUnlock = (code: string) =>
    this.unlock({ by: EDSecurityType.CODE, text: code });

  @action.bound
  public async unlock(payload: IDSecurityPayload) {
    this.isBusy = true;
    try {
      await this._authService.securityUnlock(payload);
    } finally {
      runInAction(() => this.isBusy = false);
    }
  }

  @action.bound
  public async unlockCancel(payload: IDSecurityPayload) {
    await this._securityService.unlockCancel(payload);
  }

  public signOut = () => this._authService.signOut();
}
