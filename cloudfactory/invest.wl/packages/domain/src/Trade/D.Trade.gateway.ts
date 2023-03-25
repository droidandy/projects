import { AsynX, IAsynXPagedOpts, MapX } from '@invest.wl/common';
import { IDTradeItemDTO, Inject, Injectable, Newable } from '@invest.wl/core';
import { DTradeAdapterTid, IDTradeAdapter } from './D.Trade.types';
import { DTradeModel, DTradeModelTid } from './model/D.Trade.model';

export const DTradeGatewayTid = Symbol.for('DTradeGatewayTid');

@Injectable()
export class DTradeGateway {
  constructor(
    @Inject(DTradeAdapterTid) private _adapter: IDTradeAdapter,
    @Inject(DTradeModelTid) private _itemModel: Newable<typeof DTradeModel>,
  ) {}

  public list(opts: IAsynXPagedOpts<IDTradeItemDTO, IDTradeAdapter['list']>) {
    const source = new AsynX.Paged(this._adapter.list.bind(this._adapter), opts);
    return new MapX.DList(source, () => source.data?.data, lv => new this._itemModel(lv));
  }
}
