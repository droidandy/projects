import { MapX } from '@invest.wl/common';
import { Inject, Injectable, Newable } from '@invest.wl/core';
import { DAccountListCase, DAccountListCaseTid, IDAccountListCaseProps } from '@invest.wl/domain';
import { action, makeObservable } from 'mobx';
import { VAccountByAgreementModel, VAccountByAgreementModelTid } from '../model/V.AccountByAgreement.model';
import { VAccountQUIKModel, VAccountQUIKModelTid } from '../model/V.AccountQUIK.model';

export const VAccountListPresentTid = Symbol.for('VAccountListPresentTid');

export interface IVAccountListPresentProps extends IDAccountListCaseProps {
}

@Injectable()
export class VAccountListPresent {
  public listX = new MapX.VList(this.cse.listX.source,
    () => this.cse.listX.list, v => new this.modelQUIK(v));

  public agreementListX = new MapX.VList(this.cse.agreementListX.source,
    () => this.cse.agreementListX.list, v => new this.modelByAgreement(v));

  constructor(
    @Inject(DAccountListCaseTid) public cse: DAccountListCase,
    @Inject(VAccountQUIKModelTid) private modelQUIK: Newable<typeof VAccountQUIKModel>,
    @Inject(VAccountByAgreementModelTid) private modelByAgreement: Newable<typeof VAccountByAgreementModel>,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IVAccountListPresentProps) {
    this.cse.init(props);
  }
}
