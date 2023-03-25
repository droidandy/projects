import { DModelXValue, IDModelXValue, ILambda, IMapXList, MapX, MathUtil } from '@invest.wl/common';
import { IDInstrumentExchangeResponseDTO, Injectable, IoC, Newable } from '@invest.wl/core';
import { computed, makeObservable } from 'mobx';
import { DInstrumentExchangeItemModel, DInstrumentExchangeItemModelTid, IDInstrumentExchangeItemModel } from './D.InstrumentExchangeItem.model';
import { IDInstrumentSummaryModel } from './D.InstrumentSummary.model';

export const DInstrumentExchangeListModelTid = Symbol.for('DInstrumentExchangeListModelTid');
type TDTO = IDInstrumentExchangeResponseDTO;

export interface IDInstrumentExchangeListModel<DTO extends TDTO = TDTO> extends IDModelXValue<DTO> {
  readonly listX: IMapXList<DInstrumentExchangeItemModel>;
  readonly listVolume: number;
  readonly askList: IDInstrumentExchangeItemModel[];
  readonly askVolume: number;
  readonly askVolumePercent: number;
  readonly bidList: IDInstrumentExchangeItemModel[];
  readonly bidVolume: number;
  readonly bidVolumePercent: number;
  readonly volumeMax: number;
}

export interface IDInstrumentExchangeListModelProps {
  summaryModel: ILambda<IDInstrumentSummaryModel | undefined>;
}

@Injectable()
export class DInstrumentExchangeListModel<DTO extends TDTO = TDTO> extends DModelXValue<DTO> implements IDInstrumentExchangeListModel<DTO> {
  private _modelExchangeItem = IoC.get<Newable<typeof DInstrumentExchangeItemModel>>(DInstrumentExchangeItemModelTid);

  public listX = new MapX.BaseList(() => this.dto, lv => new this._modelExchangeItem(lv, {
    volumeMax: () => this.volumeMax, summaryModel: this._props.summaryModel,
  }));

  @computed
  public get askList() {
    return this.listX.list.filter(i => i.isAsk);
  }

  @computed
  public get askVolume() {
    return this.askList.reduce((acc, item) => acc + item.volume, 0);
  }

  @computed
  public get askVolumePercent() {
    return MathUtil.divide(this.askVolume, this.listVolume) * 100;
  }

  @computed
  public get bidList() {
    return this.listX.list.filter(i => !i.isAsk);
  }

  @computed
  public get bidVolume() {
    return this.bidList.reduce((acc, item) => acc + item.volume, 0);
  }

  @computed
  public get bidVolumePercent() {
    return this.bidVolume / this.listVolume * 100;
  }

  @computed
  public get listVolume() {
    return this.bidVolume + this.askVolume;
  }

  @computed
  public get volumeMax() {
    // иначе IDE ругается на циклическую зависимость, но её нет, т.к. это реактивыне лямбда функции
    const listX: IMapXList<DInstrumentExchangeItemModel> = (this as any).listX;
    return Math.max(...listX.list.map(i => i.volume));
  }

  constructor(dtoLV: ILambda<DTO>, private _props: IDInstrumentExchangeListModelProps) {
    super(dtoLV);
    makeObservable(this);
  }
}
