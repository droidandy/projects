import { AsynX, IAsynXOpts, MapX } from '@invest.wl/common';
import { Inject, Injectable, Newable } from '@invest.wl/core';
import { DAddressAdapterTid, IDAddressAdapter } from './D.Address.types';
import { DAddressModel, DAddressModelTid } from './model/D.Address.model';

export const DAddressGatewayTid = Symbol.for('DAddressGatewayTid');

@Injectable()
export class DAddressGateway {
  constructor(
    @Inject(DAddressAdapterTid) private _adapter: IDAddressAdapter,
    @Inject(DAddressModelTid) private _model: Newable<typeof DAddressModel>,
  ) { }

  public search(opts: IAsynXOpts<IDAddressAdapter['search']>) {
    const source = new AsynX(this._adapter.search.bind(this._adapter), opts);
    return new MapX.DList(source, () => source.data?.data, v => new this._model(v));
  }
}
