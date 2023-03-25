import { Formatter, ILambda, IVModelX, pluralize, VModelX } from '@invest.wl/common';
import { EDOrderStatus, Injectable, IoC } from '@invest.wl/core';
import { IDOrderItemModel } from '@invest.wl/domain';
import { computed, makeObservable } from 'mobx';
import { IVInstrumentIdentityMpart, VInstrumentIdentityMpart } from '../../Instrument/mpart/V.InstrumentIdentity.mpart';
import { IVInstrumentI18n, VInstrumentI18nTid } from '../../Instrument/V.Instrument.types';
import { VThemeStore } from '../../Theme/V.Theme.store';
import { VThemeStoreTid } from '../../Theme/V.Theme.types';
import { IVTradeI18n, VTradeI18nTid } from '../../Trade/V.Trade.types';
import { IVOrderI18n, VOrderI18nTid } from '../V.Order.types';

export const VOrderItemModelTid = Symbol.for('VOrderItemModelTid');

export interface IVOrderItemModel extends IVModelX<IDOrderItemModel> {
  instrumentIdentity: IVInstrumentIdentityMpart;
  readonly deal: string;
  readonly payment: string;
  readonly price: string;
  readonly amount: string;
  readonly amountExchanged: string;
  readonly amountRest: string;
  readonly date: string;
  readonly status: string;
  readonly statusColor: string;
  readonly tradeCode: string;
}

@Injectable()
export class VOrderItemModel extends VModelX<IDOrderItemModel> implements IVOrderItemModel {
  private _theme = IoC.get<VThemeStore>(VThemeStoreTid);
  private _tradeI18n = IoC.get<IVTradeI18n>(VTradeI18nTid);
  private _orderI18n = IoC.get<IVOrderI18n>(VOrderI18nTid);
  private _instrumentI18n = IoC.get<IVInstrumentI18n>(VInstrumentI18nTid);

  public instrumentIdentity = new VInstrumentIdentityMpart(() => this.domain.dto.Instrument);

  @computed
  public get deal() {
    return `${this._tradeI18n.direction[this.domain.dto.BS]} ${this.amount} ${
      this.domain.instrumentType.isFX ?
        this.domain.currency :
        pluralize(this.domain.dto.Amount, this._instrumentI18n.assetTypeGenitive[this.domain.dto.Instrument.AssetType])}`;
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
    return Formatter.number(this.domain.dto.Amount, { omitZero: true, signed: false });
  }

  @computed
  public get amountExchanged() {
    return Formatter.number(this.domain.dto.AmountEx, { omitZero: true, signed: false });
  }

  @computed
  public get amountRest() {
    return Formatter.number(this.domain.dto.AmountRest, { omitZero: true, signed: false });
  }

  @computed
  public get date() {
    return Formatter.date(this.domain.dto.Date, { pattern: 'DD.MM.YY, HH:mm:ss', calendar: true });
  }

  @computed
  public get status() {
    return this._orderI18n.status[this.domain.status] ?? `Неопознанный статус: ${this.domain.status}`;
  }

  @computed
  public get statusColor() {
    switch (this.domain.status) {
      case EDOrderStatus.Deleting:
      case EDOrderStatus.NotSent:
      case EDOrderStatus.New:
        return this._theme.color.waiting;
      case EDOrderStatus.Reduced:
      case EDOrderStatus.ReducedPartial:
        return this._theme.color.positive;
      case EDOrderStatus.Error:
      case EDOrderStatus.Deleted:
        return this._theme.color.negative;
      default:
        return this._theme.color.muted3;
    }
  }

  @computed
  public get tradeCode() {
    return this.domain.dto.Account.name;
  }

  constructor(dtoLV: ILambda<IDOrderItemModel>) {
    super(dtoLV);
    makeObservable(this);
  }
}
