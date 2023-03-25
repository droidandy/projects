import { Inject, Injectable } from '@invest.wl/core';
import { action, computed, makeObservable, observable } from 'mobx';
import { VAccountAgreementCreatePresent, VAccountAgreementCreatePresentTid } from '../../../Account/present/V.AccountAgreementCreate.present';
import { VCustomerCreateSelfPresent, VCustomerCreateSelfPresentTid } from '../../../Customer/present/V.CustomerCreateSelf.present';
import {
  EVAuthSignupWithAgreementScreenStep,
  IVAuthSignupWithAgreementPresent,
  IVAuthSignupWithAgreementPresentProps,
} from './V.AuthSignupWithAgreement.types';

@Injectable()
export class VAuthSignupWithAgreementPresent implements IVAuthSignupWithAgreementPresent {
  @observable public stepIndex = 0;
  @observable.ref public props?: IVAuthSignupWithAgreementPresentProps;
  @observable protected _isBusy = false;

  @computed
  public get isBusy() {
    return this.customerCreatePr.cse.isBusy || this.agreementCreatePr.cse.isBusy || this._isBusy;
  }

  @computed
  public get step() {
    return this.stepList[this.stepIndex];
  }

  @computed
  public get stepList() {
    return [EVAuthSignupWithAgreementScreenStep.CustomerPassport];
  }

  constructor(
    @Inject(VCustomerCreateSelfPresentTid) public customerCreatePr: VCustomerCreateSelfPresent,
    @Inject(VAccountAgreementCreatePresentTid) public agreementCreatePr: VAccountAgreementCreatePresent,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IVAuthSignupWithAgreementPresentProps) {
    this.props = props;
    this.customerCreatePr.init({
      required: this.props.customerRequired, confirmNeed: this.props.customerConfirmNeed,
    });
    this.agreementCreatePr.init({});
  }

  @action
  public stepNext() {
    this.stepIndex++;
  }

  @action
  public stepPrev() {
    this.stepIndex--;
  }
}
