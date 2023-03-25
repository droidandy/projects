import { Inject, Injectable, Newable } from '@invest.wl/core';
import { ISTransportWsOb2ConnectOpts } from './Ob2';
import { STransportWsOb2Source, STransportWsOb2SourceTid } from './Ob2/S.TransportWsOb2.source';

export const STransportWsServiceTid = Symbol.for('STransportWsServiceTid');

@Injectable()
export class STransportWsService {
  constructor(
    @Inject(STransportWsOb2SourceTid) private _ob2Source: Newable<typeof STransportWsOb2Source>,
  ) { }

  public ob2(opts: ISTransportWsOb2ConnectOpts) {
    return new this._ob2Source(opts);
  }
}
