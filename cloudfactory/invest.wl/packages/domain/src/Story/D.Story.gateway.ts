import { AsynX, IAsynXOpts, IAsynXPagedOpts, MapX } from '@invest.wl/common';
import { IDStoryItemDTO, Inject, Injectable, Newable } from '@invest.wl/core';
import { DStoryAdapterTid, IDStoryAdapter } from './D.Story.types';
import { DStoryModel, DStoryModelTid } from './model/D.Story.model';
import { DStoryItemModel, DStoryItemModelTid } from './model/D.StoryItem.model';

export const DStoryGatewayTid = Symbol.for('DStoryGatewayTid');

@Injectable()
export class DStoryGateway {
  constructor(
    @Inject(DStoryAdapterTid) private _adapter: IDStoryAdapter,
    @Inject(DStoryItemModelTid) private _itemModel: Newable<typeof DStoryItemModel>,
    @Inject(DStoryModelTid) private _model: Newable<typeof DStoryModel>,
  ) {}

  info(opts: IAsynXOpts<IDStoryAdapter['info']>) {
    const source = new AsynX(this._adapter.info.bind(this._adapter), opts);
    return new MapX.D(source, () => source.data?.data, lv => new this._model(lv));
  }

  list(opts: IAsynXPagedOpts<IDStoryItemDTO, IDStoryAdapter['list']>) {
    const source = new AsynX.Paged(this._adapter.list.bind(this._adapter), opts);
    return new MapX.DList(source, () => source.data?.data, lv => new this._itemModel(lv));
  }
}
