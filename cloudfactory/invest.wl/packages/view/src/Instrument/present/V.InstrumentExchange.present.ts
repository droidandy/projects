import { MapX } from '@invest.wl/common';
import { Inject, Injectable, Newable } from '@invest.wl/core';
import { DInstrumentExchangeCase, DInstrumentExchangeCaseTid, IDInstrumentExchangeCaseProps } from '@invest.wl/domain';
import { action, makeObservable, observable } from 'mobx';

import { VInstrumentExchangeListModel, VInstrumentExchangeListModelTid } from '../model/V.InstrumentExchangeList.model';

export const VInstrumentExchangePresentTid = Symbol.for('VInstrumentExchangePresentTid');

export interface IVInstrumentExchangePresentProps extends IDInstrumentExchangeCaseProps {
}

@Injectable()
export class VInstrumentExchangePresent {
  @observable public props?: IVInstrumentExchangePresentProps;

  public exchangeListX = new MapX.V(this.cse.exchangeListX.source,
    () => this.cse.exchangeListX.model,
    (m) =>
      new this.modelExchangeList(m));

  constructor(
    @Inject(DInstrumentExchangeCaseTid) public cse: DInstrumentExchangeCase,
    @Inject(VInstrumentExchangeListModelTid) private modelExchangeList: Newable<typeof VInstrumentExchangeListModel>,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IVInstrumentExchangePresentProps) {
    this.props = props;
    this.cse.init(props);
  }
}
