import { EDSecurityType, IDSecurityPayload, Inject, Injectable } from '@invest.wl/core';
import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { DSecurityService } from '../D.Security.service';
import { DSecurityStore } from '../D.Security.store';
import { DSecurityServiceTid, DSecurityStoreTid } from '../D.Security.types';

export const DSecurityCheckCaseTid = Symbol.for('DSecurityCheckCaseTid');

export interface IDSecurityCheckCaseProps {
  biometryText?: string;
}

@Injectable()
export class DSecurityCheckCase {
  @observable.ref public props?: IDSecurityCheckCaseProps;
  @observable public isBusy = false;

  @computed
  public get biometryAccessed() {
    return this._securityStore.biometryAccessed;
  }

  constructor(
    @Inject(DSecurityServiceTid) private _securityService: DSecurityService,
    @Inject(DSecurityStoreTid) private _securityStore: DSecurityStore,
  ) {
    makeObservable(this);
  }

  @action
  public async init(props: IDSecurityCheckCaseProps) {
    this.props = props;
  }

  public biometryCheck = () =>
    this.check({ by: EDSecurityType.BIO, text: this.props?.biometryText ?? '' });

  public biometryCheckCancel = () =>
    this.checkCancel({ by: EDSecurityType.BIO, text: '' });

  public codeCheck = (code: string) =>
    this.check({ by: EDSecurityType.CODE, text: code });

  @action.bound
  public async check(payload: IDSecurityPayload): Promise<void> {
    this.isBusy = true;
    try {
      await this._securityService.check(payload);
    } finally {
      runInAction(() => this.isBusy = false);
    }
  }

  @action.bound
  public async checkCancel(payload: IDSecurityPayload) {
    await this._securityService.unlockCancel(payload);
  }
}
