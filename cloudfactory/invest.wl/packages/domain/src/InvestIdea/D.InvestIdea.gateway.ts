import { AsynX, IAsynXOpts, IAsynXPagedOpts, MapX } from '@invest.wl/common';
import { IDInvestIdeaItemDTO, Inject, Injectable, Newable } from '@invest.wl/core';
import { DInvestIdeaAdapterTid, IDInvestIdeaAdapter } from './D.InvestIdea.types';
import { DInvestIdeaModel, DInvestIdeaModelTid } from './model/D.InvestIdea.model';
import { DInvestIdeaItemModel, DInvestIdeaItemModelTid } from './model/D.InvestIdeaItem.model';

export const DInvestIdeaGatewayTid = Symbol.for('DInvestIdeaGatewayTid');

@Injectable()
export class DInvestIdeaGateway {
  constructor(
    @Inject(DInvestIdeaAdapterTid) private _adapter: IDInvestIdeaAdapter,
    @Inject(DInvestIdeaItemModelTid) private _itemModel: Newable<typeof DInvestIdeaItemModel>,
    @Inject(DInvestIdeaModelTid) private _model: Newable<typeof DInvestIdeaModel>,
  ) {}

  public info(opts: IAsynXOpts<IDInvestIdeaAdapter['info']>) {
    const source = new AsynX(this._adapter.info.bind(this._adapter), opts);
    return new MapX.D(source, () => source.data?.data, lv => new this._model(lv));
  }

  public list(opts: IAsynXPagedOpts<IDInvestIdeaItemDTO, IDInvestIdeaAdapter['list']>) {
    const source = new AsynX.Paged(this._adapter.list.bind(this._adapter), opts);
    return new MapX.DList(source, () => source.data?.data, lv => new this._itemModel(lv));
  }
}
