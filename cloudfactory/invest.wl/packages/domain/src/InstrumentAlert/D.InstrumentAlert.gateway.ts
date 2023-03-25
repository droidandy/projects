import { AsynX, IAsynXOpts, IAsynXPagedOpts, MapX } from '@invest.wl/common';
import {
  IDInstrumentAlertItemDTO,
  IDInstrumentAlertListDeleteRequestDTO,
  IDInstrumentAlertSetRequestDTO,
  IDInstrumentAlertViewedUpdateRequestDTO,
  Inject,
  Injectable,
  Newable,
} from '@invest.wl/core';
import { DInstrumentAlertAdapterTid, IDInstrumentAlertAdapter } from './D.InstrumentAlert.types';
import { DInstrumentAlertModel, DInstrumentAlertModelTid } from './model/D.InstrumentAlert.model';
import { DInstrumentAlertCountModel, DInstrumentAlertCountModelTid } from './model/D.InstrumentAlertCount.model';

export const DInstrumentAlertGatewayTid = Symbol.for('DInstrumentAlertGatewayTid');

@Injectable()
export class DInstrumentAlertGateway {
  constructor(
    @Inject(DInstrumentAlertAdapterTid) private _adapter: IDInstrumentAlertAdapter,
    @Inject(DInstrumentAlertModelTid) private _model: Newable<typeof DInstrumentAlertModel>,
    @Inject(DInstrumentAlertCountModelTid) private _countModel: Newable<typeof DInstrumentAlertCountModel>,
  ) {}

  count(opts: IAsynXOpts<IDInstrumentAlertAdapter['count']>) {
    const source = new AsynX(this._adapter.count.bind(this._adapter), opts);
    return new MapX.D(source, () => source.data?.data, lv => new this._countModel(lv));
  }

  list(opts: IAsynXPagedOpts<IDInstrumentAlertItemDTO, IDInstrumentAlertAdapter['list']>) {
    const source = new AsynX.Paged(this._adapter.list.bind(this._adapter), opts);
    return new MapX.DList(source, () => source.data?.data, lv => new this._model(lv));
  }

  set(req: IDInstrumentAlertSetRequestDTO) {
    return this._adapter.set(req);
  }

  listDelete(req: IDInstrumentAlertListDeleteRequestDTO) {
    return this._adapter.listDelete(req);
  }

  viewedUpdate(req: IDInstrumentAlertViewedUpdateRequestDTO) {
    return this._adapter.viewedUpdate(req);
  }
}
