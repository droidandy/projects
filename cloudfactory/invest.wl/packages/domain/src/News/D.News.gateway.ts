import { AsynX, IAsynXOpts, IAsynXPagedOpts, MapX } from '@invest.wl/common';
import { IDNewsItemDTO, Inject, Injectable, Newable } from '@invest.wl/core';
import { DNewsAdapterTid, IDNewsAdapter } from './D.News.types';
import { DNewsModel, DNewsModelTid } from './model/D.News.model';
import { DNewsItemModel, DNewsItemModelTid } from './model/D.NewsItem.model';

export const DNewsGatewayTid = Symbol.for('DNewsGatewayTid');

@Injectable()
export class DNewsGateway {
  constructor(
    @Inject(DNewsAdapterTid) private adapter: IDNewsAdapter,
    @Inject(DNewsItemModelTid) private itemModel: Newable<typeof DNewsItemModel>,
    @Inject(DNewsModelTid) private model: Newable<typeof DNewsModel>,
  ) {}

  public Info(opts: IAsynXOpts<IDNewsAdapter['info']>) {
    const source = new AsynX(this.adapter.info.bind(this.adapter), opts);
    return new MapX.D(source, () => source.data?.data, lv => new this.model(lv));
  }

  public list(opts: IAsynXPagedOpts<IDNewsItemDTO, IDNewsAdapter['list']>) {
    const source = new AsynX.Paged(this.adapter.list.bind(this.adapter), opts);
    return new MapX.DList(source, () => source.data?.data, lv => new this.itemModel(lv));
  }
}
