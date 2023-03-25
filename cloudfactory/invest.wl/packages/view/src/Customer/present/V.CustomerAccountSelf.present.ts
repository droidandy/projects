import { MapX } from '@invest.wl/common';
import { EDDateDayPart, Inject, Injectable, Newable } from '@invest.wl/core';
import {
  DAccountListCase,
  DAccountListCaseTid,
  DCustomerAccountSelfCase,
  DCustomerAccountSelfCaseTid,
  DDateConfig,
  DDateConfigTid,
  IDAccountListCaseProps,
  IDCustomerAccountSelfCaseProps,
} from '@invest.wl/domain';
import { action, computed, makeObservable } from 'mobx';
import { VAccountByAgreementModel, VAccountByAgreementModelTid } from '../../Account/model/V.AccountByAgreement.model';
import { IVDateI18n, VDateI18nTid } from '../../Date/V.Date.types';
import { VCustomerAccountSelfModel, VCustomerAccountSelfModelTid } from '../model/V.CustomerAccountSelf.model';

export const VCustomerAccountSelfPresentTid = Symbol.for('VCustomerAccountSelfPresentTid');

export interface IVCustomerAccountSelfPresentProps extends IDCustomerAccountSelfCaseProps, IDAccountListCaseProps {
}

@Injectable()
export class VCustomerAccountSelfPresent {
  public selfX = new MapX.V(this._cse.selfX.source,
    () => this._cse.selfX.model, v => new this.modelSelf(v));

  public agreementListX = new MapX.VList(this._accountCase.agreementListX.source,
    () => this._accountCase.agreementListX.list, v => new this.modelByAgreement(v));

  @computed
  public get welcome() {
    // TODO: need add timezone?
    const hour = new Date().getHours();
    const dayPart = Object.keys(this._dateСfg.dayPartMap).find((part) =>
      this._dateСfg.dayPartMap[part as EDDateDayPart](hour),
    ) as EDDateDayPart;
    const dayWelcomeText = this._dateI18n.dayPartWelcome[dayPart];

    return this.selfX.model?.name || this._cse.name
      ? `${this.selfX.model?.name || this._cse.name}, ${dayWelcomeText}` : dayWelcomeText.capitalize();
  }

  constructor(
    @Inject(DCustomerAccountSelfCaseTid) private _cse: DCustomerAccountSelfCase,
    @Inject(DAccountListCaseTid) private _accountCase: DAccountListCase,
    @Inject(VCustomerAccountSelfModelTid) private modelSelf: Newable<typeof VCustomerAccountSelfModel>,
    @Inject(VAccountByAgreementModelTid) private modelByAgreement: Newable<typeof VAccountByAgreementModel>,
    @Inject(VDateI18nTid) private _dateI18n: IVDateI18n,
    @Inject(DDateConfigTid) private _dateСfg: DDateConfig,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IVCustomerAccountSelfPresentProps) {
    this._cse.init(props);
    this._accountCase.init(props);
  }
}
