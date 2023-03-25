import { Formatter, MapX } from '@invest.wl/common';
import { EDCurrencyCode, Inject, Injectable, ISelectItem, Newable } from '@invest.wl/core';
import { DOperationDepositCreateCase, DOperationDepositCreateCaseTid, IDOperationDepositCreateCaseProps } from '@invest.wl/domain';
import { action, computed, makeObservable, observable } from 'mobx';
import { VAccountByAgreementModel, VAccountByAgreementModelTid } from '../../Account/model/V.AccountByAgreement.model';
import { IVCurrencyI18n, VCurrencyI18nTid } from '../../Currency/V.Currency.types';
import { EVLayoutScreen } from '../../Layout/V.Layout.types';
import { IVRouterService, VRouterServiceTid } from '../../Router/V.Router.types';
import { VOperationDepositCreateModel, VOperationDepositCreateModelTid } from '../model/V.OperationDepositCreate.model';

export const VOperationDepositCreatePresentTid = Symbol.for('VOperationDepositCreatePresentTid');

export interface IVOperationDepositCreatePresentProps extends IDOperationDepositCreateCaseProps {
}

@Injectable()
export class VOperationDepositCreatePresent {
  @observable.ref public props?: IVOperationDepositCreatePresentProps;

  public createModel = new this._modelCreate(this.createCase.createModel);

  public agreementListX = new MapX.VList(this.createCase.agreementListX.source,
    () => this.createCase.agreementListX.list, (m) => new this._modelByAgreement(m));

  @computed
  public get currencyList(): ISelectItem<EDCurrencyCode>[] {
    return this.createCase.currencyList.map(c => ({
      value: c, name: `${this._currencyI18n.name[c].many.capitalize()} (${Formatter.symbol(c)})`,
    }));
  }

  constructor(
    @Inject(DOperationDepositCreateCaseTid) public createCase: DOperationDepositCreateCase,
    @Inject(VRouterServiceTid) public router: IVRouterService,
    @Inject(VOperationDepositCreateModelTid) private _modelCreate: Newable<typeof VOperationDepositCreateModel>,
    @Inject(VAccountByAgreementModelTid) private _modelByAgreement: Newable<typeof VAccountByAgreementModel>,
    @Inject(VCurrencyI18nTid) private _currencyI18n: IVCurrencyI18n,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IVOperationDepositCreatePresentProps) {
    this.props = props;
    this.createCase.init(props);
  }

  @action.bound
  public async create() {
    this.createModel.dirtySet();
    try {
      const r = await this.createCase.create(this.createModel.domain.asDTO);
      if (r.link) this.router.navigateTo(EVLayoutScreen.LayoutWebView, { title: 'СБП', url: r.link });
    } catch (e) {
      this.router.back();
    }
  }
}
