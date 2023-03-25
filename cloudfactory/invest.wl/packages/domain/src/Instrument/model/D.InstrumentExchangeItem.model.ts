import { DModelX, IDModelX, ILambda, lambdaResolve, MathUtil } from '@invest.wl/common';
import { EDTradeDirection, IDInstrumentExchangeItemDTO, Injectable } from '@invest.wl/core';
import { computed, makeObservable } from 'mobx';
import { IDInstrumentSummaryModel } from './D.InstrumentSummary.model';

export const DInstrumentExchangeItemModelTid = Symbol.for('DInstrumentExchangeGlassItemModelTid');
type TDTO = IDInstrumentExchangeItemDTO;

export interface IDInstrumentExchangeItemModel<DTO extends TDTO = TDTO> extends IDModelX<DTO> {
  readonly tradeDirection: EDTradeDirection;
  readonly isAsk: boolean;
  readonly price: number;
  readonly volume: number;
  readonly volumePercent: number;
  readonly lotSize: number;
  readonly instrumentSummary?: IDInstrumentSummaryModel;
}

export interface IDInstrumentExchangeItemModelProps {
  volumeMax: ILambda<number>;
  summaryModel: ILambda<IDInstrumentSummaryModel | undefined>;
}

@Injectable()
export class DInstrumentExchangeItemModel<DTO extends TDTO = TDTO> extends DModelX<DTO> implements IDInstrumentExchangeItemModel<DTO> {
  @computed
  public get tradeDirection() {
    return this.isAsk ? EDTradeDirection.Buy : EDTradeDirection.Sell;
  }

  @computed
  public get isAsk() {
    return this.price >= 0;
  }

  @computed
  public get price() {
    return this.dto.price;
  }

  @computed
  public get volume() {
    return MathUtil.divide(this.dto.volume, this.lotSize);
  }

  @computed
  public get volumePercent() {
    return MathUtil.divide(this.volume, this._volumeMax) * 100;
  }

  @computed
  public get lotSize() {
    return this.instrumentSummary?.dto.Instrument.LotSize || 1;
  }

  @computed
  public get instrumentSummary() {
    return lambdaResolve(this._props.summaryModel);
  }

  @computed
  private get _volumeMax() {
    return lambdaResolve(this._props.volumeMax);
  }

  constructor(dtoLV: ILambda<DTO>, private _props: IDInstrumentExchangeItemModelProps) {
    super(dtoLV);
    makeObservable(this);
  }
}
