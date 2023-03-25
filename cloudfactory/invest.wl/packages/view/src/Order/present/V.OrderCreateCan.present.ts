import { MapX } from '@invest.wl/common';
import { Inject, Injectable, Newable } from '@invest.wl/core';
import { DOrderCreateCanCase, DOrderCreateCanCaseTid, IDOrderCreateCanCaseProps } from '@invest.wl/domain';
import { action, makeObservable, observable } from 'mobx';
import { VAccountQUIKModel, VAccountQUIKModelTid } from '../../Account/model/V.AccountQUIK.model';
import { VInstrumentSummaryModel, VInstrumentSummaryModelTid } from '../../Instrument/model/V.InstrumentSummary.model';

export const VOrderCreateCanPresentTid = Symbol.for('VOrderCreateCanPresentTid');

export interface IVOrderCreateCanPresentProps extends IDOrderCreateCanCaseProps {
}

@Injectable()
export class VOrderCreateCanPresent {
  @observable public props?: IVOrderCreateCanPresentProps;

  public instrumentSummaryX = new MapX.V(this.cse.summaryX.source,
    () => this.cse.summaryX.model,
    (m) => new this._instrumentSummaryModel(m));

  public accountListX = new MapX.VList(this.cse.accountListX.source,
    () => this.cse.accountListX.list, v => new this._accountQUIKModel(v));

  constructor(
    @Inject(DOrderCreateCanCaseTid) public cse: DOrderCreateCanCase,
    @Inject(VInstrumentSummaryModelTid) private _instrumentSummaryModel: Newable<typeof VInstrumentSummaryModel>,
    @Inject(VAccountQUIKModelTid) private _accountQUIKModel: Newable<typeof VAccountQUIKModel>,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IVOrderCreateCanPresentProps) {
    this.props = props;
    this.cse.init(props);
  }

  public dispose() {
    this.cse.dispose();
  }
}
