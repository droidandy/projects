import { EDStorageLocalKey, Inject, Injectable } from '@invest.wl/core';
import { action, computed, makeObservable, observable } from 'mobx';
import { DErrorService, DErrorServiceTid } from '../../Error/D.Error.service';
import { DStorageLocalStore, DStorageLocalStoreTid } from '../../StorageLocal/D.StorageLocal.store';
import { DSecurityStore } from '../D.Security.store';
import { DSecurityStoreTid } from '../D.Security.types';
import { DSecurityAccessCase, DSecurityAccessCaseTid, IDSecurityAccessCaseProps } from './D.SecurityAccess.case';
import { DSecurityCheckCase, DSecurityCheckCaseTid } from './D.SecurityCheck.case';

export const DSecuritySettingCaseTid = Symbol.for('DSecuritySettingCaseTid');

export interface IDSecuritySettingCaseProps extends IDSecurityAccessCaseProps {
}

@Injectable()
export class DSecuritySettingCase {
  @observable.ref public props?: IDSecuritySettingCaseProps;
  @observable public isBusy = false;

  constructor(
    @Inject(DSecurityAccessCaseTid) public accessCase: DSecurityAccessCase,
    @Inject(DStorageLocalStoreTid) private _sl: DStorageLocalStore,
    @Inject(DSecurityStoreTid) private _store: DSecurityStore,
    @Inject(DSecurityCheckCaseTid) private _checkCase: DSecurityCheckCase,
    @Inject(DErrorServiceTid) private _errorService: DErrorService,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IDSecuritySettingCaseProps) {
    this.props = props;
    this.accessCase.init(props);
  }

  @computed
  public get authSigninByBio() {
    return this.accessCase.biometryAccessed && this._sl.get(EDStorageLocalKey.AuthSigninUseBiometry) === 'true';
  }

  @action.bound
  public async authSigninByBioSet(value: boolean) {
    if (this.authSigninByBio === value) return;
    await this._biometryAccessToggle(value, 'auth');
    this._sl.set(EDStorageLocalKey.AuthSigninUseBiometry, `${value}`);
  }

  @computed
  public get orderConfirmByBio() {
    return this.accessCase.biometryAccessed && this._sl.get(EDStorageLocalKey.OrderCreateUseBiometry) === 'true';
  }

  @action.bound
  public async orderConfirmByBioSet(value: boolean) {
    if (this.orderConfirmByBio === value) return;
    await this._biometryAccessToggle(value, 'order');
    this._sl.set(EDStorageLocalKey.OrderCreateUseBiometry, `${value}`);
  }

  @computed
  public get orderConfirmByCode() {
    return this._sl.get(EDStorageLocalKey.OrderCreateUseCode) === 'true';
  }

  @action.bound
  public async orderConfirmByCodeSet(value: boolean) {
    this._sl.set(EDStorageLocalKey.OrderCreateUseCode, `${value}`);
  }

  private async _biometryAccessToggle(value: boolean, type: 'order' | 'auth') {
    if (!this.accessCase.biometryHas) throw this._errorService.progHandle('Biometry not supported');
    if (value) {
      if (!this._store.biometryAccessed) await this.accessCase.accessRequestBiometry();
    } else {
      if (this._store.safeDisable) await this._checkCase.biometryCheck();
      const otherState = type === 'order' ? this.authSigninByBio : this.orderConfirmByBio;
      if (!otherState) {
        try {
          await this.accessCase.accessRevokeBiometry();
        } catch (e) {
          // eat
        }
      }
    }
  }
}
