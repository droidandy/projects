import { Formatter, ILambda, IMapX, IVGroupXModel, IVModelX, MapX, VGroupXModel, VModelX } from '@invest.wl/common';
import { EDCurrencyCode, EDInstrumentAssetType, EDPortfelGroup, IDAccountQUIKItemDTO, Injectable, IoC, ISelectItem, Newable } from '@invest.wl/core';
import { IDPortfelPLByInstrumentModel, IDPortfelPLGroupModel } from '@invest.wl/domain';
import { computed, makeObservable } from 'mobx';
import { IVAccountByAgreementModel, VAccountByAgreementModel, VAccountByAgreementModelTid } from '../../Account/model/V.AccountByAgreement.model';
import { IVAccountQUIKModel, VAccountQUIKModel, VAccountQUIKModelTid } from '../../Account/model/V.AccountQUIK.model';
import { IVInstrumentI18n, VInstrumentI18nTid } from '../../Instrument/V.Instrument.types';
import { VThemeStore } from '../../Theme/V.Theme.store';
import { VThemeStoreTid } from '../../Theme/V.Theme.types';
import { IVPortfelPLByInstrumentModel, VPortfelPLByInstrumentModel, VPortfelPLByInstrumentModelTid } from './V.PortfelPLByInstrument.model';

export const VPortfelPLGroupModelTid = Symbol.for('VPortfelPLGroupModelTid');

export interface IVPortfelPLGroupModel extends IVModelX<IDPortfelPLGroupModel> {
  readonly groupX: IVGroupXModel<IVPortfelPLByInstrumentModel, IVPortfelPLGroupModel, IDPortfelPLByInstrumentModel, EDPortfelGroup, { marketValueAbs: ILambda<number> }, IDPortfelPLGroupModel>;
  readonly accountX: IMapX<IVAccountQUIKModel>;
  readonly agreementX: IMapX<IVAccountByAgreementModel<IDAccountQUIKItemDTO>>;
  readonly itemFirst?: IVPortfelPLByInstrumentModel;
  readonly currency?: EDCurrencyCode;
  readonly instrumentCurrency?: EDCurrencyCode;
  readonly marketValue: string;
  readonly marketPrice: string;
  readonly mvPortfelPercent: string;
  readonly mvGroupPercent: string;
  readonly amount: string;
  readonly aquisition: string;
  readonly priceAvg: string;
  readonly plTotal: string;
  readonly instrumentAquisition: string;
  readonly instrumentMarketValue: string;
  readonly instrumentYield: string;
  readonly instrumentYieldPercent: string;
  readonly instrumentPlTotal: string;
  readonly yield: string;
  readonly yieldPercent: string;
  readonly growColor: string;
  readonly instrumentAssetType: string;
  readonly statList: ISelectItem<string>[];
  readonly canBuy: boolean;
}

@Injectable()
export class VPortfelPLGroupModel extends VModelX<IDPortfelPLGroupModel> implements IVPortfelPLGroupModel {
  private _theme = IoC.get<VThemeStore>(VThemeStoreTid);
  private _instrumentI18n = IoC.get<IVInstrumentI18n>(VInstrumentI18nTid);
  private _accountModel = IoC.get<Newable<typeof VAccountQUIKModel>>(VAccountQUIKModelTid);
  private _accountByAgreementModel = IoC.get<Newable<typeof VAccountByAgreementModel>>(VAccountByAgreementModelTid);
  private _portfelPLByInstrumentModel = IoC.get<Newable<typeof VPortfelPLByInstrumentModel>>(VPortfelPLByInstrumentModelTid);
  private _portfelPLGroupModel = IoC.get<Newable<typeof VPortfelPLGroupModel>>(VPortfelPLGroupModelTid);

  public accountX = new MapX.Base(() => this.domain.account, (v) => new this._accountModel(v));
  public agreementX = new MapX.Base(() => this.domain.agreement, (v) => new this._accountByAgreementModel(v));

  public groupX = new VGroupXModel(() => this.domain.groupX, {
    itemFabric: (m) => new this._portfelPLByInstrumentModel(m),
    groupFabric: (m) => new this._portfelPLGroupModel(m),
  });

  @computed
  public get itemFirst(): VPortfelPLByInstrumentModel | undefined {
    return this.groupX.listX.list[0];
  }

  @computed
  public get currency() {
    return this.domain.currency;
  }

  @computed
  public get instrumentCurrency() {
    return this.itemFirst?.domain.type.currency;
  }

  @computed
  public get marketValue() {
    return Formatter.currency(this.domain.marketValue, { code: this.currency });
  }

  @computed
  public get marketPrice() {
    return Formatter.currency(this.domain.marketPrice, { code: this.currency });
  }

  @computed
  public get mvPortfelPercent() {
    return Formatter.currency(this.domain.mvPortfelPercent, { symbol: '%' });
  }

  @computed
  public get mvGroupPercent() {
    return Formatter.currency(this.domain.mvGroupPercent, { symbol: '%' });
  }

  @computed
  public get amount() {
    if (!this.itemFirst) {
      return '0';
    }
    const { assetType, currency } = this.itemFirst.domain.type;
    const symbol = assetType === EDInstrumentAssetType.Money ? 'шт.' : '';
    const code = assetType !== EDInstrumentAssetType.Money ? currency : '';
    return Formatter.currency(this.domain.amount, { code, symbol, omitZero: true });
  }

  @computed
  public get aquisition() {
    return Formatter.currency(this.domain.aquisition, { code: this.currency });
  }

  @computed
  public get priceAvg() {
    if (!this.itemFirst) {
      return '0';
    }
    const { assetType, currency } = this.itemFirst.domain.type;
    const symbol = assetType === EDInstrumentAssetType.Bond ? '%' : '';
    const code = ![EDInstrumentAssetType.Bond, EDInstrumentAssetType.Future].includes(this.itemFirst.domain.type.assetType) ? currency : '';
    return Formatter.currency(this.domain.priceAvg, { code, symbol });
  }

  @computed
  public get plTotal() {
    return Formatter.currency(this.domain.plTotal, { code: this.currency, signed: true });
  }

  @computed
  public get instrumentAquisition() {
    return Formatter.currency(this.domain.instrumentAquisition, { symbol: this.itemFirst?.domain.type.symbolMoney });
  }

  @computed
  public get instrumentMarketValue() {
    return Formatter.currency(this.domain.instrumentMarketValue, { symbol: this.itemFirst?.domain.type.symbolMoney });
  }

  @computed
  public get instrumentYield() {
    return Formatter.currency(this.domain.instrumentYield, {
      symbol: this.itemFirst?.domain.type.symbolMoney, signed: true,
    });
  }

  @computed
  public get instrumentYieldPercent() {
    return Formatter.currency(this.domain.instrumentYieldPercent, { symbol: '%' });
  }

  @computed
  public get instrumentPlTotal() {
    return Formatter.currency(this.domain.instrumentPlTotal, {
      symbol: this.itemFirst?.domain.type.symbolMoney, signed: true,
    });
  }

  @computed
  public get yield() {
    return Formatter.currency(this.domain.yield, { code: this.currency, signed: true });
  }

  @computed
  public get yieldPercent() {
    return Formatter.currency(this.domain.yieldPercent, { symbol: '%' });
  }

  @computed
  public get growColor() {
    return this.domain.isGrow ? this._theme.color.positive : this._theme.color.negativeLight;
  }

  @computed
  public get instrumentAssetType() {
    if (this.domain.instrumentAssetType == null) {
      return '';
    }
    const str = this._instrumentI18n.assetType[this.domain.instrumentAssetType]?.many;
    if (!str) {
      console.error(`no locale for "${this.domain.instrumentAssetType}" assetType`);
    }
    return (str || '').capitalize();
  }

  @computed
  public get statList(): ISelectItem<string>[] {
    return [
      { name: 'Штук', value: Formatter.number(this.domain.amount, { omitZero: true }) },
      { name: 'Стоимость приобретения', value: this.instrumentAquisition },
      { name: 'Рыночная стоимость', value: this.instrumentMarketValue },
      { name: 'Доходность', value: `${this.instrumentYield} (${this.instrumentYieldPercent})` },
    ];
  }

  @computed
  public get canBuy() {
    return this.domain.instrumentAssetType !== EDInstrumentAssetType.Money && this.domain.isEmpty;
  }

  constructor(dtoLV: ILambda<IDPortfelPLGroupModel>) {
    super(dtoLV);
    makeObservable(this);
  }
}
