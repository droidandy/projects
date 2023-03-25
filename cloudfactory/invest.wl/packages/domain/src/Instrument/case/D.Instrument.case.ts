import { IDInstrumentId, Inject, Injectable } from '@invest.wl/core';
import { action, makeObservable, observable } from 'mobx';
import { DInstrumentGateway, DInstrumentGatewayTid } from '../D.Instrument.gateway';
import { DInstrumentConfig, DInstrumentConfigTid } from '../D.Instrument.config';

export const DInstrumentCaseTid = Symbol.for('DInstrumentCaseTid');

export interface IDInstrumentCaseProps {
  cid: IDInstrumentId;
}

@Injectable()
export class DInstrumentCase {
  @observable.ref public props?: IDInstrumentCaseProps;

  public summaryX = this._gw.summary({
    name: 'DOrderCreateCanCase.summaryX', req: () => this.props?.cid.toJSON(),
    interval: this._cfg.summaryUpdateInterval, silent: true,
  });

  constructor(
    @Inject(DInstrumentGatewayTid) private _gw: DInstrumentGateway,
    @Inject(DInstrumentConfigTid) private _cfg: DInstrumentConfig,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IDInstrumentCaseProps) {
    this.props = props;
  }
}
