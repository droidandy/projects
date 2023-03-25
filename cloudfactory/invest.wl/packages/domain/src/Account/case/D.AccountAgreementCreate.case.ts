import { EDAccountMarketType, Inject, Injectable, Newable } from '@invest.wl/core';
import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { DAuthConfig } from '../../Auth/D.Auth.config';
import { DAuthConfigTid } from '../../Auth/D.Auth.types';
import { DBankAccountEditModel, DBankAccountEditModelTid } from '../../BankAccount/model/D.BankAccountEdit.model';
import { DErrorService, DErrorServiceTid } from '../../Error/D.Error.service';
import { DInputCodeModel } from '../../Input/model/D.InputCode.model';
import { DQuestionGateway } from '../../Question/D.Question.gateway';
import { DQuestionGatewayTid } from '../../Question/D.Question.types';
import { EDTimerBgName } from '../../Timer/D.Timer.types';
import { DTimerBgModel } from '../../Timer/model/D.TimerBg.model';
import { DAccountGateway, DAccountGatewayTid } from '../D.Account.gateway';
import { DAccountAgreementCreateModel, DAccountAgreementCreateModelTid } from '../model/D.AccountAgreementCreate.model';

export const DAccountAgreementCreateCaseTid = Symbol.for('DAccountAgreementCreateCaseTid');

export interface IDAccountAgreementCreateCaseProps {
}

@Injectable()
export class DAccountAgreementCreateCase {
  @observable.ref public props?: IDAccountAgreementCreateCaseProps;

  @observable public isBusy = false;
  @observable public isConfirmed = false;

  public code = new DInputCodeModel({ length: 4 });
  public timer = new DTimerBgModel({ name: EDTimerBgName.CustomerFormDocument });

  public accountAgreementModel = new this._accountAgreementModel();
  public bankAccountModel = new this._bankAccountModel();

  @computed
  public get isValid() {
    return this.accountAgreementModel.isValid && this.bankAccountModel.isValid;
  }

  @computed
  public get isPDLValid() {
    return this.questionSectionPdlX.list.every(q => q.isValid);
  }

  public questionSectionPdlX = this._questionGw.list({
    name: 'DAccountAgreementCreateCase.questionSectionPdlX', req: () => ({ sectionList: ['PDL'] }),
  });

  constructor(
    @Inject(DAccountGatewayTid) private _gw: DAccountGateway,
    @Inject(DQuestionGatewayTid) private _questionGw: DQuestionGateway,
    @Inject(DAccountAgreementCreateModelTid) private _accountAgreementModel: Newable<typeof DAccountAgreementCreateModel>,
    @Inject(DBankAccountEditModelTid) private _bankAccountModel: Newable<typeof DBankAccountEditModel>,
    @Inject(DErrorServiceTid) private _errorService: DErrorService,
    @Inject(DAuthConfigTid) private _authCfg: DAuthConfig,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IDAccountAgreementCreateCaseProps) {
    this.props = props;
  }

  @action
  public async create() {
    if (!this.isValid) throw this._errorService.businessHandle('Неверный логин-пароль');
    try {
      this.isBusy = true;
      const agreementDTO = this.accountAgreementModel.asDTO;
      const res = await this._gw.agreementCreate({
        bankAccount: this.bankAccountModel.asDTO,
        ...agreementDTO,
        marketTypeList: agreementDTO.marketTypeList as EDAccountMarketType[],
      });
      await this.timer.start(this._authCfg.smsCodeResendInterval);
      return res;
    } finally {
      runInAction(() => {
        this.isBusy = false;
        this.codeClean();
      });
    }
  }

  @action.bound
  public async codeResend() {
    if (!this.isValid) throw this._errorService.businessHandle('Неверно заполнены данные');
    try {
      this.isBusy = true;
      await this._gw.agreementCreateCodeResend({});
      await this.timer.start(this._authCfg.smsCodeResendInterval);
    } finally {
      runInAction(() => this.isBusy = false);
    }
  };

  @action
  public async confirm() {
    if (!this.code.isValid) throw this._errorService.businessHandle('Неверный код подтверждения');
    try {
      this.isBusy = true;
      await this._gw.agreementCreateConfirm({ code: this.code.value! });
      await this.timer.clear();
      this.isConfirmed = true;
      this.reset();
    } finally {
      runInAction(() => {
        this.isBusy = false;
        this.codeClean();
      });
    }
  }


  @action
  public reset() {
    this.bankAccountModel.clear();
    this.accountAgreementModel.clear();
  }

  @action.bound
  public codeClean() {
    this.code.valueSet(undefined);
  }
}
