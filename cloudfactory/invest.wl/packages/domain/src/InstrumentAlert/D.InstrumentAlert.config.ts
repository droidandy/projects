import { Inject, Injectable } from '@invest.wl/core';
import { DInstrumentAlertAdapterTid, IDInstrumentAlertAdapter } from './D.InstrumentAlert.types';

export const DInstrumentAlertConfigTid = Symbol.for('DInstrumentAlertConfigTid');

@Injectable()
export class DInstrumentAlertConfig {
  constructor(
    @Inject(DInstrumentAlertAdapterTid) private _adapter: IDInstrumentAlertAdapter,
  ) { }

  public get updateInterval() {
    return this._adapter.updateInterval;
  }
}
