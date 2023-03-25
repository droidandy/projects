import { Inject, Injectable } from '@invest.wl/core';
import { DInstrumentAdapterTid, IDInstrumentAdapter } from './D.Instrument.types';

export const DInstrumentConfigTid = Symbol.for('DInstrumentConfigTid');

@Injectable()
export class DInstrumentConfig {
  public get quoteListUpdateInterval() {
    return this._adapter.quoteListUpdateInterval;
  }

  public get summaryUpdateInterval() {
    return this._adapter.quoteListUpdateInterval;
  }

  public get searchTextMinLength() {
    return this._adapter.searchTextMinLength;
  }

  public get searchInputDelay() {
    return this._adapter.searchInputDelay;
  }

  constructor(
    @Inject(DInstrumentAdapterTid) private _adapter: IDInstrumentAdapter,
  ) {}
}
