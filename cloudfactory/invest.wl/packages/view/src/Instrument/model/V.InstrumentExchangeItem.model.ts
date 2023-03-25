import { Formatter, ILambda, IVModelX, VModelX } from '@invest.wl/common';
import { EDCurrencyCode, Injectable, IoC } from '@invest.wl/core';
import { IDInstrumentExchangeItemModel } from '@invest.wl/domain';
import { computed, makeObservable } from 'mobx';
import { IVThemeStore, VThemeStoreTid } from '../../Theme/V.Theme.types';

export const VInstrumentExchangeItemModelTid = Symbol.for('VInstrumentExchangeItemModelTid');

export interface IVInstrumentExchangeItemModel extends IVModelX<IDInstrumentExchangeItemModel> {
  readonly volume: string;
  readonly price: string;
  readonly color: string;
  readonly volumePercent: string;
}

@Injectable()
export class VInstrumentExchangeItemModel extends VModelX<IDInstrumentExchangeItemModel> implements IVInstrumentExchangeItemModel {
  private _theme = IoC.get<IVThemeStore>(VThemeStoreTid);

  @computed
  public get volume() {
    return Formatter.number(this.domain.volume, { omitZero: true });
  }

  @computed
  public get price() {
    return Formatter.currency(this.domain.price, {
      signed: false, symbol: this._symbol, priceStep: this.domain.instrumentSummary?.dto.Instrument.PriceStep,
    });
  }

  @computed
  public get color() {
    return this.domain.isAsk ? this._theme.color.primary1 : this._theme.color.accent2;
  }

  @computed
  public get volumePercent() {
    return Formatter.currency(this.domain.volumePercent, { symbol: '%' });
  }

  constructor(dtoLV: ILambda<IDInstrumentExchangeItemModel>) {
    super(dtoLV);
    makeObservable(this);
  }

  @computed
  private get _symbol() {
    return this.domain.instrumentSummary?.type.symbol || Formatter.symbol(EDCurrencyCode.RUR);
  }
}

