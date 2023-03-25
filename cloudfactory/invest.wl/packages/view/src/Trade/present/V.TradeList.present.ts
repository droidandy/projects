import { MapX, VFilterX } from '@invest.wl/common';
import { Inject, Injectable, Newable } from '@invest.wl/core';
import { DTradeListCase, DTradeListCaseTid, IDTradeListCaseProps } from '@invest.wl/domain';
import { action, makeObservable, observable } from 'mobx';
import { VTradeModel, VTradeModelTid } from '../model/V.Trade.model';

export const VTradeListPresentTid = Symbol.for('VTradeListPresentTid');

export interface IVTradeListPresentProps extends IDTradeListCaseProps {
}

@Injectable()
export class VTradeListPresent {
  @observable.ref public props?: IVTradeListPresentProps;

  public listX = new MapX.VList(this.cse.listX.source,
    () => this.cse.listX.list, (m) => new this.model(m));

  public filterX = new VFilterX(this.cse.filterX, {
    InstrumentName: { title: 'Имя инструмента', hidden: true },
    Date: { title: 'Дата', separate: true, hidden: true },
    AccountName: { title: 'Счет', separate: true },
    BS: {},
  });

  constructor(
    @Inject(DTradeListCaseTid) public cse: DTradeListCase,
    @Inject(VTradeModelTid) private model: Newable<typeof VTradeModel>,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IVTradeListPresentProps) {
    this.props = props;
    this.cse.init(props);
  }
}
