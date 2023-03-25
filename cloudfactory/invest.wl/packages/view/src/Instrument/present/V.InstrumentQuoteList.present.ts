import { MapX, VSortX } from '@invest.wl/common';
import { Inject, Injectable, Newable } from '@invest.wl/core';
import { DInstrumentQuoteListCase, DInstrumentQuoteListCaseTid } from '@invest.wl/domain';
import { action, makeObservable, observable } from 'mobx';
import { VInstrumentQuoteModel, VInstrumentQuoteModelTid } from '../model/V.InstrumentQuote.model';
import { IVInstrumentQuoteListPresentProps } from '../V.Instrument.types';

@Injectable()
export class VInstrumentQuoteListPresent {
  @observable public props?: IVInstrumentQuoteListPresentProps;

  public quoteListX = new MapX.VList(
    this.cse.quoteListX.source,
    () => this.cse.quoteListX.list,
    (m) => new this.modelQuote(m),
  );

  public sortX = new VSortX(this.cse.sortX, {
    Change: { title: 'По доходности за день' },
    Volume: { title: 'По торговому обороту за день' },
  }, { applyOnChange: false });

  constructor(
    @Inject(DInstrumentQuoteListCaseTid) public cse: DInstrumentQuoteListCase,
    @Inject(VInstrumentQuoteModelTid) private modelQuote: Newable<typeof VInstrumentQuoteModel>,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IVInstrumentQuoteListPresentProps) {
    this.props = props;
    this.cse.init(props);
  }

  public dispose() {
    this.sortX.dispose();
    this.cse.dispose();
  }
}
