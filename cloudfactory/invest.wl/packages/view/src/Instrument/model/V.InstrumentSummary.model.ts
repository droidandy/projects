import { Formatter, ILambda, IVModelX, VModelX } from '@invest.wl/common';
import { EDInstrumentTradeState, EDOrderCreateCan, Injectable, ISelectItem } from '@invest.wl/core';
import { IDInstrumentSummaryModel } from '@invest.wl/domain';
import isNumber from 'lodash/isNumber';
import { computed, makeObservable } from 'mobx';
import moment from 'moment';
import { IVInstrumentIdentityMpart, VInstrumentIdentityMpart } from '../mpart/V.InstrumentIdentity.mpart';
import { IVInstrumentInfoMpart, VInstrumentInfoMpart } from '../mpart/V.InstrumentInfo.mpart';

export const VInstrumentSummaryModelTid = Symbol.for('VInstrumentSummaryModelTid');

export interface IVInstrumentSummaryModel extends IVModelX<IDInstrumentSummaryModel> {
  readonly identity: IVInstrumentIdentityMpart;
  readonly info: IVInstrumentInfoMpart;
  readonly date: string;
  readonly priceOpen: string;
  readonly priceClose: string;
  readonly ideaStat: ISelectItem<string>[];
  readonly marketStat: ISelectItem<string>[];
  readonly marketStatBond: ISelectItem<string>[];
  readonly marketStatFutureOption: ISelectItem<string>[];
  readonly isTrading: boolean;
  readonly isNullTimeToOpenTradeSession: boolean;
  readonly tradeOpenAt: string;
  readonly notional: string;
  readonly NKD: string;
  readonly maturity?: string;
  readonly orderCannotText?: string;
  readonly buyButtonDisabled: boolean;
  readonly sellButtonDisabled: boolean;
  readonly exchange: string;
}

@Injectable()
export class VInstrumentSummaryModel extends VModelX<IDInstrumentSummaryModel> implements IVInstrumentSummaryModel {
  public identity = new VInstrumentIdentityMpart(() => this.domain.dto.Instrument);
  public info = new VInstrumentInfoMpart(() => this.domain.dto.Instrument);

  @computed
  public get exchange() {
    return this.domain.dto.Instrument.Exchange;
  }

  @computed
  public get date() {
    return Formatter.date(this.domain.dto.Instrument.Updated, { pattern: 'D MMM, HH:mm', calendar: true });
  }

  @computed
  public get priceOpen() {
    const { OpenPrice, PriceStep, OpenPricePercent } = this.domain.dto.Instrument;
    const price = this.info.isBond ? OpenPricePercent : OpenPrice;
    return Formatter.currency(price, { priceStep: PriceStep, symbol: this.info.symbol });
  }

  @computed
  public get priceClose() {
    const { ClosePrice, PriceStep, ClosePricePercent } = this.domain.dto.Instrument;
    const price = this.info.isBond ? ClosePricePercent : ClosePrice;
    return Formatter.currency(price, { priceStep: PriceStep, symbol: this.info.symbol });
  }

  @computed
  public get ideaStat(): ISelectItem<string>[] {
    return [
      { name: 'Цена открытия', value: this.priceOpen },
      { name: 'Текущая цена', value: this.info.midRate },
      { name: 'Цена продажи', value: this.priceClose },
    ];
  }

  @computed
  public get marketStat(): ISelectItem<string>[] {
    const instrument = this.domain.dto.Instrument;
    const { symbol } = this.info;
    const priceStep = instrument.PriceStep;
    return [
      { name: 'Открытие', value: this.priceOpen },
      { name: 'Закрытие', value: this.priceClose },
      { name: 'Максимум', value: Formatter.currency(instrument.HighPrice, { priceStep, symbol }) },
      { name: 'Минимум', value: Formatter.currency(instrument.LowPrice, { priceStep, symbol }) },
      { name: 'Объём', value: Formatter.number(instrument.Volume, { short: true, precision: 3 }) },
    ];
  }

  @computed
  public get marketStatBond(): ISelectItem<string>[] {
    const result: ISelectItem<string>[] = [];
    const instrument = this.domain.dto.Instrument;
    const { isBond } = this.info;
    const priceStep = instrument.PriceStep;
    if (isBond) {
      if (isNumber(instrument.AI)) result.push({ name: 'НКД', value: this.NKD });
      result.push({
        name: 'Ном.стоим.',
        value: Formatter.currency(instrument.Notional, { code: this.info.currency, priceStep }),
      });
      result.push({ name: 'Погаш.', value: this.maturity });
    }
    return result;
  }

  @computed
  public get marketStatFutureOption(): ISelectItem<string>[] {
    const instrument = this.domain.dto.Instrument;
    const { isOption, isFuture } = this.info;
    const result: ISelectItem<string>[] = [];
    if (isFuture || isOption) {
      result.push({ name: 'Экспирация', value: this.maturity });
      result.push({
        name: 'ГО Покупателя',
        value: Formatter.currency(instrument.InitialMargin, { code: this.info.currency }),
      });
      // result.push({ name: 'ГО ПОКУПАТЕЛЯ', value: Formatter.currency(instrument.SellDepo, { code: this.info.currency }) });
      // result.push({ name: 'ГО ПРОДАВЦА', value: Formatter.currency(instrument.BuyDepo, { code: this.info.currency }) });
    }
    return result;
  }

  @computed
  public get isTrading() {
    return this.domain.dto.Instrument.State === EDInstrumentTradeState.Trading;
  }

  @computed
  public get isNullTimeToOpenTradeSession() {
    return !this.domain.dto.Instrument.TimeToOpenTradeSession;
  }

  @computed
  public get tradeOpenAt() {
    if (this.isNullTimeToOpenTradeSession) return 'В настоящий момент биржа не работает';

    const timeToOpenTradeSession = moment.duration(this.domain.dto.Instrument.TimeToOpenTradeSession);
    let hours = Math.trunc(timeToOpenTradeSession.asHours()).toString();
    hours = hours.length === 1 ? `0${hours}` : hours;
    let minutes = timeToOpenTradeSession.minutes().toString();
    minutes = minutes.length === 1 ? `0${minutes}` : minutes;

    return `До начала торгов осталось ${hours} ч. ${minutes} мин.`;
  }

  @computed
  public get notional() {
    return Formatter.currency(this.domain.dto.Instrument.Notional, {
      code: this.info.currency, priceStep: this.info.priceStep,
    });
  }

  @computed
  public get NKD() {
    return Formatter.currency(this.domain.dto.Instrument.AI, { code: this.info.currency });
  }

  public get maturity() {
    const { Perpetual, MaturityDate } = this.domain.dto.Instrument;
    if (this.info.isBond && Perpetual === 1) return 'бессрочная';
    return MaturityDate ? Formatter.date(MaturityDate, { pattern: 'date' }) : '';
  }

  @computed
  public get orderCannotText() {
    const summary = this.domain;
    let textCannotOrder = '';
    switch (summary.orderCan) {
      case EDOrderCreateCan.ErrorDisabled:
        textCannotOrder = 'Вы не подключены к торгам. Для получения дополнительной информации свяжитесь со службой поддержки';
        break;
      case EDOrderCreateCan.ErrorDisabledForAccount:
        textCannotOrder = 'У вас не отрыты счета или они по каким то причинам недоступны для совершения операций.' +
              ' Для получения дополнительной информации свяжитесь со службой поддержки';
        break;
      case EDOrderCreateCan.ErrorDisabledNoAccount:
        textCannotOrder = 'У вас не настроен ни один счет для  подачи поручений или счета временно заблокированы для совершения операций.' +
              ' Для получения дополнительной информации свяжитесь со службой поддержки';
        break;
      case EDOrderCreateCan.ErrorInstrumentNotAvailable:
        textCannotOrder = 'Выбранный инструмент недоступен для торговли';
        break;
      case EDOrderCreateCan.ErrorNoAccount:
        textCannotOrder = 'Нет доступных счетов';
        break;
    }
    return textCannotOrder;
  }

  @computed
  public get buyButtonDisabled() {
    return [
      EDOrderCreateCan.Cant,
      EDOrderCreateCan.ErrorDisabledForProduct,
      EDOrderCreateCan.IsOTC,
      EDOrderCreateCan.NotAllowedToBuy,
    ].includes(this.domain.orderCan);
  }

  @computed
  public get sellButtonDisabled() {
    return [
      EDOrderCreateCan.Cant,
      EDOrderCreateCan.ErrorDisabledForProduct,
    ].includes(this.domain.orderCan);
  }

  constructor(dtoLV: ILambda<IDInstrumentSummaryModel>) {
    super(dtoLV);
    makeObservable(this);
  }
}
