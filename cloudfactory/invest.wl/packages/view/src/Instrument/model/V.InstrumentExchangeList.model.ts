import { Formatter, ILambda, IMapXList, IVModelXValue, MapX, VModelXValue } from '@invest.wl/common';
import { Injectable, IoC, Newable } from '@invest.wl/core';
import { IDInstrumentExchangeListModel } from '@invest.wl/domain';
import orderBy from 'lodash/orderBy';
import { computed, makeObservable } from 'mobx';
import { IVInstrumentExchangeItemModel, VInstrumentExchangeItemModel, VInstrumentExchangeItemModelTid } from './V.InstrumentExchangeItem.model';

export const VInstrumentExchangeListModelTid = Symbol.for('VInstrumentExchangeListModelTid');

export interface IVInstrumentExchangeListModel extends IVModelXValue<IDInstrumentExchangeListModel> {
  readonly bidVolumePercent: string;
  readonly askVolumePercent: string;
  readonly askList: IVInstrumentExchangeItemModel[];
  readonly bidList: IVInstrumentExchangeItemModel[];
  readonly listX: IMapXList<IVInstrumentExchangeItemModel>;
}

@Injectable()
export class VInstrumentExchangeListModel extends VModelXValue<IDInstrumentExchangeListModel> implements IVInstrumentExchangeListModel {
  private _modelExchangeItem = IoC.get<Newable<typeof VInstrumentExchangeItemModel>>(VInstrumentExchangeItemModelTid);

  @computed
  public get bidVolumePercent() {
    return Formatter.currency(this.domain.bidVolumePercent, { symbol: '%' });
  }

  @computed
  public get askVolumePercent() {
    return Formatter.currency(this.domain.askVolumePercent, { symbol: '%' });
  }

  public listX = new MapX.BaseList(() => this.domain.listX.list,
    v => new this._modelExchangeItem(v));

  @computed
  public get askList() {
    return orderBy(this.listX.list.filter(i => i.domain.isAsk), el => Math.abs(el.domain.price), 'desc');
  }

  @computed
  public get bidList() {
    return orderBy(this.listX.list.filter(i => !i.domain.isAsk), el => Math.abs(el.domain.price), 'desc');
  }

  constructor(dtoLV: ILambda<IDInstrumentExchangeListModel>) {
    super(dtoLV);
    makeObservable(this);
  }
}
