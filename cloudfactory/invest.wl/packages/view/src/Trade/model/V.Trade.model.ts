import { Formatter, ILambda, IVModelX, pluralize, VModelX } from '@invest.wl/common';
import { Injectable, IoC } from '@invest.wl/core';
import { IDTradeModel } from '@invest.wl/domain';
import { computed, makeObservable } from 'mobx';
import { IVInstrumentIdentityMpart, VInstrumentIdentityMpart } from '../../Instrument/mpart/V.InstrumentIdentity.mpart';
import { IVInstrumentI18n, VInstrumentI18nTid } from '../../Instrument/V.Instrument.types';
import { IVTradeI18n, VTradeI18nTid } from '../V.Trade.types';

export const VTradeModelTid = Symbol.for('VTradeModelTid');

export interface IVTradeModel extends IVModelX<IDTradeModel> {
  readonly instrumentIdentity: IVInstrumentIdentityMpart;
  readonly deal: string;
  readonly payment: string;
  readonly price: string;
  readonly amount: string;
  readonly date: string;
  readonly tradeCode: string;
}

@Injectable()
export class VTradeModel extends VModelX<IDTradeModel> implements IVTradeModel {
  public instrumentIdentity = new VInstrumentIdentityMpart(() => this.domain.dto.Instrument);
  private _tradeI18n = IoC.get<IVTradeI18n>(VTradeI18nTid);
  private _instrumentI18n = IoC.get<IVInstrumentI18n>(VInstrumentI18nTid);

  @computed
  public get deal() {
    return `${this._tradeI18n.direction[this.domain.dto.BS]} ${this.amount} ${
      this.domain.instrumentType.isFX ?
        this.domain.currency :
        pluralize(this.domain.amount, this._instrumentI18n.assetTypeGenitive[this.domain.dto.Instrument.AssetType])}`;
  }

  @computed
  public get payment() {
    return Formatter.currency(this.domain.dto.Payment, { signed: true, code: this.domain.currency });
  }

  @computed
  public get price() {
    return Formatter.currency(this.domain.dto.Price, {
      code: this.domain.currency, priceStep: this.domain.dto.Instrument.PriceStep,
    });
  }

  @computed
  public get amount() {
    return Formatter.currency(this.domain.amount, { signed: false, omitZero: true });
  }

  @computed
  public get date() {
    return Formatter.date(this.domain.dto.Date, { pattern: 'DD.MM.YY, HH:mm:ss', calendar: true });
  }

  @computed
  public get tradeCode() {
    return this.domain.dto.Account.name;
  }

  constructor(dtoLV: ILambda<IDTradeModel>) {
    super(dtoLV);
    makeObservable(this);
  }
}
