import { divide, DModelX, IDModelX, ILambda, lambdaResolve, subtract } from '@invest.wl/common';
import { EDCurrencyCode, EDPortfelOperationType, EDTradeMarket, IDAccountQUIKItemDTO, IDPortfelPLByInstrumentItemDTO, Injectable, IoC } from '@invest.wl/core';
import { computed, makeObservable, observable } from 'mobx';
import { DAccountStore, DAccountStoreTid } from '../../Account/D.Account.store';
import { IDAccountByAgreementModel } from '../../Account/model/D.AccountByAgreement.model';
import { IDAccountQUIKModel } from '../../Account/model/D.AccountQUIK.model';
import { DInstrumentTypeMpart, IDInstrumentTypeMpart } from '../../Instrument/mpart/D.InstrumentType.mpart';
import { DPortfelConfig } from '../D.Portfel.config';
import { DPortfelConfigTid } from '../D.Portfel.types';

export const DPortfelPLByInstrumentModelTid = Symbol.for('DPortfelPLByInstrumentModelTid');
type TDTO = IDPortfelPLByInstrumentItemDTO;

export interface IDPortfelPLByInstrumentModelProps {
  currency: ILambda<EDCurrencyCode>;
}

// детализация активов по инструментам
export interface IDPortfelPLByInstrumentModel<DTO extends TDTO = TDTO> extends IDModelX<DTO> {
  readonly type: IDInstrumentTypeMpart;
  readonly account?: IDAccountQUIKModel;
  readonly agreement?: IDAccountByAgreementModel<IDAccountQUIKItemDTO>;

  // валюта выбранная в портфеле
  readonly currency: EDCurrencyCode;
  // рыночная стоимость
  readonly marketValue: number;
  // рыночная стоимость по модулю
  readonly marketValueAbs: number;
  // рыночная цена за штуку
  readonly marketPrice: number;
  // количество
  readonly amount: number;
  // стоимость приобретения
  readonly aquisition: number;
  // цена приобретения
  readonly priceAvg: number;
  // прибыль\убыток (тоже самое что и доходность?)
  readonly plTotal: number;
  // доходность
  readonly yield: number;
  // доходность в процентах
  readonly yieldPercent: number;
  // стоимость приобретения в валюте инструмента
  readonly instrumentAquisition: number;
  // рыночная стоимость в валюте инструмента
  readonly instrumentMarketValue: number;
  // прибыль\убыток в валюте инструмента
  readonly instrumentPlTotal: number;
  readonly instrumentYield: number;
  readonly instrumentYieldPercent: number;
  readonly operationTypeId?: EDPortfelOperationType;
  readonly market?: EDTradeMarket;
  readonly isGrow: boolean;
  groupPercentCalc(groupMvAbs: number): number;
}

@Injectable()
export class DPortfelPLByInstrumentModel<DTO extends TDTO = TDTO> extends DModelX<DTO> implements IDPortfelPLByInstrumentModel<DTO> {
  private _const = IoC.get<DPortfelConfig>(DPortfelConfigTid);
  private _accountStore = IoC.get<DAccountStore>(DAccountStoreTid);

  public type = new DInstrumentTypeMpart(() => this.dto.Instrument);

  @observable private _props: IDPortfelPLByInstrumentModelProps;

  constructor(dtoLV: ILambda<DTO>, props: IDPortfelPLByInstrumentModelProps) {
    super(dtoLV);
    makeObservable(this);
    this._props = props;
  }

  @computed
  public get account() {
    return this._accountStore.listX.list.find(a => a.id === this.dto.Account.id);
  }

  @computed
  public get agreement() {
    return this.account && this._accountStore.agreementListX.list.find(a => a.accountIdList.includes(this.account!.id));
  }

  @computed
  public get currency() {
    return lambdaResolve(this._props.currency);
  }

  @computed
  public get marketValue() {
    return this.dto.MarketValue || 0;
  }

  @computed
  public get marketValueAbs() {
    return Math.abs(this.marketValue);
  }

  @computed
  public get aquisition() {
    return this.dto.Aquisition || 0;
  }

  @computed
  public get plTotal() {
    return this.dto.TotalPL || 0;
  }

  @computed
  public get amount() {
    return this.dto.Amount || 0;
  }

  @computed
  public get priceAvg() {
    return this.dto.AvgCostPrice || 0;
  }

  @computed
  public get instrumentPlTotal() {
    return this.dto.TotalPLInstr || 0;
  }

  @computed
  public get instrumentMarketValue() {
    return this.dto.MarketValueInstr || 0;
  }

  @computed
  public get instrumentAquisition() {
    return this.dto.AquisitionInstr || 0;
  }

  @computed
  public get instrumentYield() {
    return subtract(this.instrumentMarketValue, this.instrumentAquisition);
  }

  @computed
  public get instrumentYieldPercent() {
    return divide(this.instrumentYield, this.instrumentAquisition) * 100;
  }

  @computed
  public get operationTypeId() {
    return this.dto.OperationTypeId;
  }

  @computed
  public get marketPrice() {
    return Math.abs(divide(this.marketValue, this.amount));
  }

  @computed
  public get yield() {
    return subtract(this.marketValue, this.aquisition);
  }

  @computed
  public get yieldPercent() {
    return divide(this.yield, this.aquisition) * 100;
  }

  @computed
  public get market(): EDTradeMarket | undefined {
    return this._const.groupByMarketList.find(g => g.filter(this.dto))?.id as EDTradeMarket;
  }

  @computed
  public get isGrow() {
    return this.yield >= 0;
  }

  public groupPercentCalc(groupMvAbs: number) {
    return divide(this.marketValueAbs, groupMvAbs) * 100;
  }
}
