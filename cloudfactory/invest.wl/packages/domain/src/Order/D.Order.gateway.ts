import { AsynX, IAsynXOpts, IAsynXPagedOpts, MapX } from '@invest.wl/common';
import {
  IDOrderCancelRequestDTO,
  IDOrderIdCreateRequestDTO,
  IDOrderItemDTO,
  IDOrderRequestConfirmRequestDTO,
  IDOrderRequestCreateRequestDTO,
  Inject,
  Injectable,
  Newable,
} from '@invest.wl/core';
import { DOrderAdapterTid, IDOrderAdapter } from './D.Order.types';
import { DOrderInfoModel, DOrderInfoModelTid } from './model/D.OrderInfo.model';
import { DOrderItemModel, DOrderItemModelTid } from './model/D.OrderItem.model';

export const DOrderGatewayTid = Symbol.for('DOrderGatewayTid');

@Injectable()
export class DOrderGateway {
  constructor(
    @Inject(DOrderAdapterTid) private _adapter: IDOrderAdapter,
    @Inject(DOrderItemModelTid) private _itemModel: Newable<typeof DOrderItemModel>,
    @Inject(DOrderInfoModelTid) private _infoModel: Newable<typeof DOrderInfoModel>,
  ) {}

  public info(opts: IAsynXOpts<IDOrderAdapter['info']>) {
    const source = new AsynX(this._adapter.info.bind(this._adapter), opts);
    return new MapX.D(source, () => source.data?.data, lv => new this._infoModel(lv));
  }

  public list(opts: IAsynXPagedOpts<IDOrderItemDTO, IDOrderAdapter['list']>) {
    const source = new AsynX.Paged(this._adapter.list.bind(this._adapter), opts);
    return new MapX.DList(source, () => source.data?.data, lv => new this._itemModel(lv));
  }

  public cancel(req: IDOrderCancelRequestDTO) {
    return this._adapter.cancel(req);
  }

  public idCreate(req: IDOrderIdCreateRequestDTO) {
    return this._adapter.idCreate(req);
  }

  public requestCreate(req: IDOrderRequestCreateRequestDTO) {
    return this._adapter.requestCreate(req);
  }

  public requestConfirm(req: IDOrderRequestConfirmRequestDTO) {
    return this._adapter.requestConfirm(req);
  }
}
