import { Formatter, pluralize } from '@invest.wl/common';
import { EDInstrumentAssetType, EDOrderType, EDTradeDirection, Injectable, IObjectItem, IoC } from '@invest.wl/core';
import { IDInputBinaryModel, IDInputNumberModel, IDOrderCreateModel } from '@invest.wl/domain';
import { IVTradeI18n, VTradeI18nTid } from '../../Trade/V.Trade.types';
import { computed, makeObservable, when, action } from 'mobx';
import { VInputBinaryModel } from '../../Input/model/V.InputBinary.model';
import { VInputIdModel } from '../../Input/model/V.InputId.model';
import { VInputNumberModel } from '../../Input/model/V.InputNumber.model';
import { VInputStringModel } from '../../Input/model/V.InputString.model';
import { IVInputFormModel } from '../../Input/V.Input.types';
import { VInputFormModel } from '../../Input/V.InputForm.model';
import { IVInstrumentI18n, VInstrumentI18nTid } from '../../Instrument/V.Instrument.types';

export const VOrderCreateModelTid = Symbol.for('VOrderCreateModelTid');

export interface IVOrderCreateModel extends IVInputFormModel<IDOrderCreateModel> {
  readonly typeMarket: VInputBinaryModel<EDOrderType>;
  readonly amount: string;
  readonly price: string;
  readonly priceTitle: string;
  readonly amountLotLabel: string;
  readonly lotMaxLabel?: string;
  readonly priceLabel: string;
  readonly costTitle: string;
  readonly cost: string;
  readonly summary: IObjectItem<string>[];
  readonly marketCan: boolean;
  readonly isTypeMarket: boolean;
  readonly nameAction: string;
  amountLotSetMax(): void;
}

@Injectable()
export class VOrderCreateModel extends VInputFormModel<IDOrderCreateModel> implements IVOrderCreateModel {
  public typeMarket = new VInputBinaryModel(this.domain.typeMarket);
  private _instrumentI18n = IoC.get<IVInstrumentI18n>(VInstrumentI18nTid);
  private _tradeI18n = IoC.get<IVTradeI18n>(VTradeI18nTid);

  @computed
  public get amount() {
    return Formatter.currency(this.fields.amount.domain.value, { omitZero: true, symbol: 'шт.' });
  }

  @computed
  public get price() {
    const instrument = this.domain.instrument;
    if (!instrument) return '';
    const { AssetType } = instrument.dto;
    if (AssetType == null ||
      [EDInstrumentAssetType.Future, EDInstrumentAssetType.Option].includes(AssetType)) {
      return '';
    }
    if (this.fields.type.domain.value === EDOrderType.Market) return 'По рынку';

    return Formatter.currency(this.fields.price.domain.value, {
      symbol: instrument.type.symbol, priceStep: this.domain.priceStep,
    });
  }

  @computed
  public get priceTitle() {
    const assetType = this.domain.instrument?.dto.AssetType;
    if (assetType == null ||
      [EDInstrumentAssetType.Future, EDInstrumentAssetType.Option].includes(assetType)) {
      return '';
    }
    if ([EDInstrumentAssetType.Equity, EDInstrumentAssetType.Bond].includes(assetType)) {
      return 'Цена за шт.';
    }
    if ([EDInstrumentAssetType.FX].includes(assetType)) {
      return 'Курс сделки';
    }
    return '';
  }

  @computed
  public get amountLotLabel() {
    const { lotSize, instrument } = this.domain;
    if (!instrument) return '';
    return `Количество лотов (1 лот = ${pluralize(lotSize, this._instrumentI18n.assetType[instrument.dto.AssetType], { withNumber: true })})`;
  }

  @computed
  public get lotMaxLabel() {
    if (this.domain.lotMax == null || this.typeMarket.isChecked) return;
    const lotMax = Formatter.number(this.domain.lotMax, { omitZero: true });
    return `Максимальное количество доступное для ${this.domain.fields.bs.value === EDTradeDirection.Buy ? 'покупки' : 'продажи'} 
    за счет собственных средств = ${lotMax} лотов`;
  }

  @computed
  public get priceLabel() {
    const instrument = this.domain.instrument;
    return `Укажите цену (шаг цены ${Formatter.currency(this.domain.priceStep, {
      symbol: instrument?.type.symbol, priceStep: this.domain.priceStep,
    })})`;
  }

  @computed
  public get costTitle() {
    const assetType = this.domain.instrument?.dto.AssetType;
    if (assetType == null || [EDInstrumentAssetType.Option].includes(assetType)) return '';
    if (assetType === EDInstrumentAssetType.Future) {
      return 'Сумма гарантийного обеспечения';
    } else {
      return 'Сумма (без учета комиссии)';
    }
  }

  @computed
  public get cost() {
    const instrument = this.domain.instrument;
    return Formatter.currency(this.domain.cost, {
      symbol: instrument?.type.symbolMoney, priceStep: this.domain.priceStep, omitZero: true,
    });
  }

  @computed
  public get lastOrderPrice() {
    const instrument = this.domain.instrument;
    if (!instrument) return '';
    return Formatter.currency(instrument.dto.MidRate, {
      symbol: instrument.type.symbolMoney, priceStep: this.domain.priceStep,
    });
  }

  @computed
  public get nameAction() {
    return this._tradeI18n.directionAction[this.fields.bs.domain.value!];
  }

  public fields = {
    id: new VInputIdModel(this.domain.fields.id, { valueSetSkip: true }),
    accountId: new VInputIdModel(this.domain.fields.accountId),
    type: new VInputNumberModel(this.domain.fields.type as IDInputNumberModel),
    price: new VInputNumberModel(this.domain.fields.price as IDInputNumberModel),
    // кол-во меняется через amountLot!
    amount: new VInputNumberModel(this.domain.amountLot as IDInputNumberModel),
    sourceObjectId: new VInputNumberModel(this.domain.fields.sourceObjectId as IDInputNumberModel, { valueSetSkip: true }),
    sourceType: new VInputNumberModel(this.domain.fields.sourceType as IDInputNumberModel, { valueSetSkip: true }),
    tradeAccountMapId: new VInputIdModel(this.domain.fields.tradeAccountMapId, { valueSetSkip: true }),
    bs: new VInputBinaryModel(this.domain.fields.bs as IDInputBinaryModel<EDTradeDirection>, { valueSetSkip: true }),
    instrument: {
      id: new VInputIdModel(this.domain.fields.instrument.id, { valueSetSkip: true }),
      secureCode: new VInputStringModel(this.domain.fields.instrument.secureCode, { valueSetSkip: true }),
      classCode: new VInputStringModel(this.domain.fields.instrument.classCode, { valueSetSkip: true }),
    },
  };

  @computed
  public get summary() {
    return [
      { key: 'Количество', value: this.amount },
      { key: this.priceTitle, value: this.price },
      { key: this.costTitle, value: this.cost },
      { key: 'Цена последней сделки', value: this.lastOrderPrice },
    ].filter(i => i.key);
  }

  @computed
  public get marketCan() {
    return !!this.domain.instrument?.dto.CanMarketOrder;
  }

  @computed
  public get isTypeMarket() {
    return this.fields.type.domain.value === EDOrderType.Market;
  }

  constructor(domain: IDOrderCreateModel) {
    super(domain);
    makeObservable(this);

    this.fields.type.domain.valueSet(() => this.marketCan ? this.typeMarket.domain.value : EDOrderType.LMT);
    this.fields.price.domain.valueSet(() => this.fields.type.domain.value === EDOrderType.Market
      ? this.domain.instrumentPrice : this.fields.price.numberX.value);
    when(() => !!this.domain.instrument, () => {
      this.fields.price.valueInputSet(this.domain.instrumentPrice);
    });
  }

  @action.bound
  public amountLotSetMax() {
    const { fields: { amount }, domain: { lotMax } } = this;
    amount.valueInputSet(lotMax);
  }
}
