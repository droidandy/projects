import { Formatter, ILambda, IMapX, IVModelX, MapX, VModelX } from '@invest.wl/common';
import { IDAccountQUIKItemDTO, Injectable, IoC, Newable } from '@invest.wl/core';
import { IDPortfelPLByInstrumentModel } from '@invest.wl/domain';
import { computed, makeObservable } from 'mobx';
import { IVAccountByAgreementModel, VAccountByAgreementModel, VAccountByAgreementModelTid } from '../../Account/model/V.AccountByAgreement.model';
import { IVAccountQUIKModel, VAccountQUIKModel, VAccountQUIKModelTid } from '../../Account/model/V.AccountQUIK.model';
import { IVInstrumentIdentityMpart, VInstrumentIdentityMpart } from '../../Instrument/mpart/V.InstrumentIdentity.mpart';
import { IVInstrumentI18n, VInstrumentI18nTid } from '../../Instrument/V.Instrument.types';
import { VThemeStore } from '../../Theme/V.Theme.store';
import { VThemeStoreTid } from '../../Theme/V.Theme.types';
import { IVTradeI18n, VTradeI18nTid } from '../../Trade/V.Trade.types';

export const VPortfelPLByInstrumentModelTid = Symbol.for('VPortfelPLByInstrumentModelTid');

export interface IVPortfelPLByInstrumentModel extends IVModelX<IDPortfelPLByInstrumentModel> {
  readonly accountX?: IMapX<IVAccountQUIKModel>;
  readonly agreementX?: IMapX<IVAccountByAgreementModel<IDAccountQUIKItemDTO>>;
  readonly identity: IVInstrumentIdentityMpart;
  readonly assetType: string;
  readonly assetSubType: string;
  readonly marketValue: string;
  readonly marketPrice: string;
  readonly instrumentMarketValue: string;
  readonly instrumentAquisition: string;
  readonly instrumentYield: string;
  readonly instrumentYieldPercent: string;
  readonly instrumentPlTotal: string;
  readonly aquisition: string;
  readonly priceAvg: string;
  readonly plTotal: string;
  readonly amount: string;
  readonly yield: string;
  readonly yieldPercent: string;
  readonly market: string;
  readonly growColor: string;
  readonly linkDisabled: boolean;
}

@Injectable()
export class VPortfelPLByInstrumentModel extends VModelX<IDPortfelPLByInstrumentModel> implements IVPortfelPLByInstrumentModel {
  private _theme = IoC.get<VThemeStore>(VThemeStoreTid);
  private _tradeI18n = IoC.get<IVTradeI18n>(VTradeI18nTid);
  private _instrumentI18n = IoC.get<IVInstrumentI18n>(VInstrumentI18nTid);
  private _accountModel = IoC.get<Newable<typeof VAccountQUIKModel>>(VAccountQUIKModelTid);
  private _accountByAgreementModel = IoC.get<Newable<typeof VAccountByAgreementModel>>(VAccountByAgreementModelTid);

  public accountX = new MapX.Base(() => this.domain.account, (v) => new this._accountModel(v));
  public agreementX = new MapX.Base(() => this.domain.agreement, (v) => new this._accountByAgreementModel(v));
  public identity = new VInstrumentIdentityMpart(() => this.domain.dto.Instrument);

  @computed
  public get assetType() {
    return (this._instrumentI18n.assetType[this.domain.type.assetType]?.many || '').capitalize();
  }

  @computed
  public get assetSubType() {
    return (this._instrumentI18n.assetType[this.domain.type.assetSubType]?.many || '').capitalize();
  }

  @computed
  public get marketValue() {
    return Formatter.currency(this.domain.marketValue, { code: this.domain.currency });
  }

  @computed
  public get marketPrice() {
    return Formatter.currency(this.domain.marketPrice, { code: this.domain.currency });
  }

  @computed
  public get aquisition() {
    return Formatter.currency(this.domain.aquisition, { code: this.domain.currency });
  }

  @computed
  public get priceAvg() {
    return Formatter.currency(this.domain.priceAvg, { code: this.domain.currency });
  }

  @computed
  public get plTotal() {
    return Formatter.currency(this.domain.plTotal, { code: this.domain.currency, signed: true });
  }

  @computed
  public get amount() {
    return Formatter.currency(this.domain.amount, { symbol: 'шт', omitZero: true });
  }

  @computed
  public get instrumentAquisition() {
    return Formatter.currency(this.domain.instrumentAquisition, { symbol: this.domain.type.symbol });
  }

  @computed
  public get instrumentMarketValue() {
    return Formatter.currency(this.domain.instrumentMarketValue, { symbol: this.domain.type.symbol });
  }

  @computed
  public get instrumentYield() {
    return Formatter.currency(this.domain.instrumentYield, { symbol: this.domain.type.symbol, signed: true });
  }

  @computed
  public get instrumentYieldPercent() {
    return Formatter.currency(this.domain.instrumentYieldPercent, { symbol: '%' });
  }

  @computed
  public get instrumentPlTotal() {
    return Formatter.currency(this.domain.instrumentPlTotal, { symbol: this.domain.type.symbol, signed: true });
  }

  @computed
  public get yield() {
    return Formatter.currency(this.domain.yield, { code: this.domain.currency });
  }

  @computed
  public get yieldPercent() {
    return Formatter.currency(this.domain.yieldPercent, { symbol: '%' });
  }

  @computed
  public get market() {
    return this._tradeI18n.market[this.domain.market!] || '';
  }

  @computed
  public get growColor() {
    return this.domain.isGrow ? this._theme.color.positive : this._theme.color.negativeLight;
  }

  @computed
  public get linkDisabled() {
    return this.domain.account?.type.isMarketOTC || this.domain.type.isMoney;
  }

  constructor(dtoLV: ILambda<IDPortfelPLByInstrumentModel>) {
    super(dtoLV);
    makeObservable(this);
  }
}
