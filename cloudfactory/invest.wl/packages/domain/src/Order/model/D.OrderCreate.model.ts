import { ILambda, LambdaX, MathUtil, numberRound } from '@invest.wl/common';
import {
  EDOrderSource, EDOrderType, EDTradeDirection, IDOrderRequestCreateRequestDTO, Injectable,
} from '@invest.wl/core';
import { computed, makeObservable, when } from 'mobx';
import { IDAccountQUIKModel } from '../../Account';
import { IDInputFormModel } from '../../Input/D.Input.types';
import { DInputValidator } from '../../Input/D.Input.validator';
import { DInputFormModel } from '../../Input/D.InputForm.model';
import { DInputBinaryModel, IDInputBinaryModel } from '../../Input/model/D.InputBinary.model';
import { DInputIdModel } from '../../Input/model/D.InputId.model';
import { DInputNumberModel, IDInputNumberModel } from '../../Input/model/D.InputNumber.model';
import { DInputStringModel } from '../../Input/model/D.InputString.model';
import { IDInstrumentInfoModel } from '../../Instrument/model/D.InstrumentInfo.model';

export const DOrderCreateModelTid = Symbol.for('DOrderCreateModelTid');
type TDTO = IDOrderRequestCreateRequestDTO;

export interface IDOrderCreateModelProps {
  isPlacement?: boolean;
  instrument: ILambda<IDInstrumentInfoModel | undefined>;
  accountList: ILambda<IDAccountQUIKModel[] | undefined>;
}

export interface IDOrderCreateModel extends IDInputFormModel<TDTO> {
  readonly typeMarket: IDInputBinaryModel<EDOrderType>;
  readonly amountLot: IDInputNumberModel;
  readonly instrument?: IDInstrumentInfoModel;
  // список счетов на которые можно совершить покупку данного инструмента
  readonly accountList?: IDAccountQUIKModel[];
  // счет который был выбран
  readonly account?: IDAccountQUIKModel;
  // для облигаций цена выражается в процентах
  readonly instrumentPrice: number;
  readonly cost: number;
  readonly isBuy: boolean;
  readonly isSell: boolean;
  readonly lotSize: number;
  readonly lotMax?: number;
  readonly priceStep: number;
}

@Injectable()
export class DOrderCreateModel extends DInputFormModel<TDTO> implements IDOrderCreateModel {
  public typeMarket = new DInputBinaryModel({
    values: [EDOrderType.LMT, EDOrderType.Market],
  }).valueSet(EDOrderType.Market);

  public amountLot = new DInputNumberModel({ validatorList: [DInputValidator.numberRequired] })
    .precisionSet(() => ['USDRUB_TMS', 'EURRUB_TMS'].includes(this.instrument?.dto.SecureCode!) ? 1 : 0);

  @computed
  public get account() {
    const accountId = this.fields.accountId.value;
    return this.accountList?.find(a => a.id === accountId);
  }

  @computed
  public get isBuy() {
    return this.fields.bs.value === EDTradeDirection.Buy;
  }

  @computed
  public get isSell() {
    return this.fields.bs.value === EDTradeDirection.Sell;
  }

  @computed
  public get instrumentPrice() {
    if (!this.instrument) {
      return 0;
    }
    const instrument = this.instrument.dto;
    return this.instrument.type.isBond ? instrument.MidRatePercent : instrument.MidRate;
  }

  @computed
  public get cost() {
    const { price, amount } = this.fields;
    const model = this.instrument;
    if (!model || !price.value || !amount.value) {
      return 0;
    }
    if (model.type.isFuture) {
      return numberRound(price.value * amount.value, 2);
    }
    return numberRound(price.value * model.dto.Factor + model.dto.AI, 2) * (this.amountLot.value || 0);
  }

  @computed
  public get lotSize() {
    return this.instrument?.dto.LotSize || 0;
  }

  @computed
  public get lotMax() {
    if (!this.instrument || !this.account) return;
    const freeCash = Math.max(this.account.dto.FreeCashInstrumentCurrency, 0);
    if (freeCash <= 0) return 0;
    const price = this.fields.price.value;
    const instrument = this.instrument.dto;
    const freeInstrumentAmount = this.account.dto.FreeInstrumentAmount;
    const remains = MathUtil.divide(freeInstrumentAmount, this.lotSize);
    let result = 0;
    if (this.fields.bs.value === EDTradeDirection.Buy) {
      if (this.instrument.type.isFuture || this.instrument.type.isOption) {
        result = Math.floor(freeCash / instrument.InitialMargin / this.lotSize);
      } else {
        result = price ? Math.floor(MathUtil.divide(freeCash, (price * instrument.Factor + instrument.AI))) : 0;
      }
      if (result && remains < 0) result += remains;
    } else {
      if (this.instrument.type.isFuture || this.instrument.type.isOption) {
        result = Math.floor(freeCash / instrument.InitialMargin / this.lotSize);
        if (result && remains > 0) result += remains;
      } else {
        result = MathUtil.divide(freeInstrumentAmount, this.lotSize);
      }
    }
    return result;
  }

  @computed
  public get instrument() {
    return LambdaX.resolve(this.props.instrument);
  }

  @computed
  public get accountList() {
    return LambdaX.resolve(this.props.accountList);
  }

  @computed
  public get priceStep() {
    if (!this.instrument) {
      return 0;
    }
    return this.instrument.type.isBond ? 0.01 : this.instrument.dto.PriceStep;
  }

  constructor(private props: IDOrderCreateModelProps) {
    super({
      id: new DInputIdModel({ validatorList: [DInputValidator.required] }),
      accountId: new DInputIdModel({ validatorList: [DInputValidator.required] }),
      // сюда должен приходить VAmount * Instrument.LotSize, а не просто VAmount
      amount: new DInputNumberModel({ validatorList: [DInputValidator.numberRequired] })
        .valueSet(() => (this.amountLot.value || 0) * this.lotSize),
      price: new DInputNumberModel({
        validatorList: [DInputValidator.numberRequired,
          (value: number) => DInputValidator.divisible(value, this.instrument?.dto.PriceStep ?? 1, `Шаг цены ${this.instrument?.dto.PriceStep}`)],
      }),
      type: new DInputNumberModel({ validatorList: [DInputValidator.required] }),
      bs: new DInputBinaryModel({
        values: [EDTradeDirection.Buy, EDTradeDirection.Sell],
        validatorList: [DInputValidator.required],
      }),
      sourceObjectId: new DInputNumberModel(props.isPlacement ? { validatorList: [DInputValidator.required] } : undefined),
      sourceType: new DInputNumberModel()
        .valueSet(() => this.fields.type.value === EDOrderType.Negotiated ? EDOrderSource.Placement : undefined),
      tradeAccountMapId: new DInputIdModel({ validatorList: [DInputValidator.required] }),
      instrument: {
        id: new DInputIdModel({ validatorList: [DInputValidator.required] }),
        classCode: new DInputStringModel({ validatorList: [DInputValidator.required] }),
        secureCode: new DInputStringModel({ validatorList: [DInputValidator.required] }),
      },
    });
    makeObservable(this);
  }

  public fromDTO(dto: TDTO) {
    super.fromDTO(dto);
    if (dto.type && dto.type !== EDOrderType.Market) {
      this.typeMarket.valueSet(EDOrderType.LMT);
    }
    when(() => !!this.instrument, () => {
      this.amountLot.valueSet(MathUtil.divide(dto.amount, this.lotSize));
      if (dto.type === EDOrderType.Market) {
        this.fields.price.valueSet(this.instrumentPrice);
      }
    });
    return this;
  }
}
