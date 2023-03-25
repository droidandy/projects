import { EDSecurityType, IDSecurityPayload, Inject, Injectable, Newable } from '@invest.wl/core';
import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { DAuthService } from '../../Auth/D.Auth.service';
import { DAuthServiceTid } from '../../Auth/D.Auth.types';
import { DErrorService, DErrorServiceTid } from '../../Error/D.Error.service';
import { DSecurityConfig, DSecurityConfigTid } from '../D.Security.config';
import { DSecurityService } from '../D.Security.service';
import { DSecurityStore } from '../D.Security.store';
import { DSecurityServiceTid, DSecurityStoreTid } from '../D.Security.types';
import { DSecurityCodeModel, DSecurityCodeModelTid } from '../model/D.SecurityCode.model';

export const DSecurityAccessCaseTid = Symbol.for('DSecurityAccessCaseTid');

export interface IDSecurityAccessCaseProps {
}

@Injectable()
export class DSecurityAccessCase {
  @observable.ref public props?: IDSecurityAccessCaseProps;
  @observable public isBusy = false;

  public codeModel = new this._codeModel({ length: this._const.codeLength });

  @computed
  public get codeAccessed() {
    return this._store.codeAccessed;
  }

  @computed
  public get biometryAccessed() {
    return this._store.biometryAccessed;
  }

  @computed
  public get biometryHas() {
    return this._store.biometryHas;
  }

  constructor(
    @Inject(DAuthServiceTid) private _authService: DAuthService,
    @Inject(DSecurityServiceTid) private _service: DSecurityService,
    @Inject(DSecurityStoreTid) private _store: DSecurityStore,
    @Inject(DSecurityCodeModelTid) private _codeModel: Newable<typeof DSecurityCodeModel>,
    @Inject(DSecurityConfigTid) private _const: DSecurityConfig,
    @Inject(DErrorServiceTid) private _errorService: DErrorService,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IDSecurityAccessCaseProps) {
    this.props = props;
  }

  public accessRequestCode = () => {
    if (!this.codeModel.isValid) throw this._errorService.businessHandle('Code not entered');
    return this.accessRequest({ by: EDSecurityType.CODE, text: this.codeModel.fields.code.value! });
  };
  public accessRevokeCode = () => this.accessRevoke({ by: EDSecurityType.CODE, text: '' });

  public accessRequestBiometry = () => this.accessRequest({ by: EDSecurityType.BIO, text: '' });
  public accessRevokeBiometry = () => this.accessRevoke({ by: EDSecurityType.BIO, text: '' });
  public unlockCancelBiometry = () => this._service.unlockCancel({ by: EDSecurityType.BIO, text: '' });

  @action.bound
  public async accessRequest(payload: IDSecurityPayload) {
    try {
      this.isBusy = true;
      await this._authService.securityAccess(payload);
    } finally {
      runInAction(() => (this.isBusy = false));
    }
  }

  @action.bound
  public async accessRevoke(payload: IDSecurityPayload) {
    try {
      this.isBusy = true;
      await this._service.accessRevoke(payload);
    } finally {
      runInAction(() => (this.isBusy = false));
    }
  }

  @action.bound
  public async unlockCancel(payload: IDSecurityPayload) {
    await this._service.unlockCancel(payload);
  }
}
