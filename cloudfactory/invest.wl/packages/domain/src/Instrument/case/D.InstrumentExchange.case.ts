import { IDInstrumentId, Inject, Injectable } from '@invest.wl/core';
import { action, makeObservable, observable } from 'mobx';
import { DInstrumentGateway, DInstrumentGatewayTid } from '../D.Instrument.gateway';

export const DInstrumentExchangeCaseTid = Symbol.for('DInstrumentExchangeCaseTid');

export interface IDInstrumentExchangeCaseProps {
  cid: IDInstrumentId;
}

@Injectable()
export class DInstrumentExchangeCase {
  @observable.ref public props?: IDInstrumentExchangeCaseProps;

  public exchangeListX = this._gw.exchangeList({
    name: 'DInstrumentExchangeCase.exchangeX', req: () => this.props ? { id: this.props.cid } : undefined,
  }, {
    summaryModel: () => this.summaryX.model,
  });

  public summaryX = this._gw.summary({
    name: 'DInstrumentHistoryCase.summaryX', req: () => this.props?.cid.toJSON(),
  });

  constructor(
    @Inject(DInstrumentGatewayTid) private _gw: DInstrumentGateway,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IDInstrumentExchangeCaseProps) {
    this.props = props;
  }
}
