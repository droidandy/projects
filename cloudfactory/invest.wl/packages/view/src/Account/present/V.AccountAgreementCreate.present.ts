import { MapX } from '@invest.wl/common';
import { Inject, Injectable, Newable } from '@invest.wl/core';
import { DAccountAgreementCreateCase, DAccountAgreementCreateCaseTid, IDAccountAgreementCreateCaseProps } from '@invest.wl/domain';
import { action, makeObservable } from 'mobx';
import { VBankAccountEditModel, VBankAccountEditModelTid } from '../../BankAccount/model/V.BankAccountEdit.model';
import { VInputCodeModel } from '../../Input/model/V.InputCode.model';
import { VQuestionModel, VQuestionModelTid } from '../../Question/model/V.Question.model';
import { VTimerBgModel } from '../../Timer/model/V.TimerBg.model';
import { VAccountAgreementCreateModel, VAccountAgreementCreateModelTid } from '../model/V.AccountAgreementCreate.model';

export const VAccountAgreementCreatePresentTid = Symbol.for('VAccountAgreementCreatePresentTid');

export interface IVAccountAgreementCreatePresentProps extends IDAccountAgreementCreateCaseProps {
}

@Injectable()
export class VAccountAgreementCreatePresent {
  public accountAgreementModel = new this._accountAgreementModel(this.cse.accountAgreementModel);
  public bankAccountModel = new this._bankAccountModel(this.cse.bankAccountModel);

  public code = new VInputCodeModel(this.cse.code);
  public timer = new VTimerBgModel(this.cse.timer);

  public questionSectionPdlX = new MapX.VList(this.cse.questionSectionPdlX.source,
    () => this.cse.questionSectionPdlX.list, v => new this._questionModel(v));

  constructor(
    @Inject(DAccountAgreementCreateCaseTid) public cse: DAccountAgreementCreateCase,
    @Inject(VAccountAgreementCreateModelTid) private _accountAgreementModel: Newable<typeof VAccountAgreementCreateModel>,
    @Inject(VBankAccountEditModelTid) private _bankAccountModel: Newable<typeof VBankAccountEditModel>,
    @Inject(VQuestionModelTid) private _questionModel: Newable<typeof VQuestionModel>,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IVAccountAgreementCreatePresentProps) {
    this.cse.init(props);
  }
}
