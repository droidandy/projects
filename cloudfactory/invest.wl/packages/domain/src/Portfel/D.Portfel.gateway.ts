import { AsynX, IAsynXOpts, MapX } from '@invest.wl/common';
import { Inject, Injectable, Newable } from '@invest.wl/core';
import { DPortfelAdapterTid, IDPortfelAdapter } from './D.Portfel.types';
import { DPortfelMVHistoryModel, DPortfelMVHistoryModelTid } from './model/D.PortfelMVHistory.model';
import { DPortfelPLByInstrumentModel, DPortfelPLByInstrumentModelTid, IDPortfelPLByInstrumentModelProps } from './model/D.PortfelPLByInstrument.model';
import { DPortfelPLHistoryModel, DPortfelPLHistoryModelTid } from './model/D.PortfelPLHistory.model';
import { DPortfelSummaryModel, DPortfelSummaryModelTid, IDPortfelSummaryModelProps } from './model/D.PortfelSummary.model';
import { DPortfelYieldHistoryModel, DPortfelYieldHistoryModelTid } from './model/D.PortfelYieldHistory.model';

export const DPortfelGatewayTid = Symbol.for('DPortfelGatewayTid');

@Injectable()
export class DPortfelGateway {
  constructor(
    @Inject(DPortfelAdapterTid) private _adapter: IDPortfelAdapter,
    @Inject(DPortfelSummaryModelTid) private _summaryModel: Newable<typeof DPortfelSummaryModel>,
    @Inject(DPortfelPLByInstrumentModelTid) private _byInstrumentModel: Newable<typeof DPortfelPLByInstrumentModel>,
    @Inject(DPortfelYieldHistoryModelTid) private _yieldHistoryModel: Newable<typeof DPortfelYieldHistoryModel>,
    @Inject(DPortfelMVHistoryModelTid) private _mvHistoryModel: Newable<typeof DPortfelMVHistoryModel>,
    @Inject(DPortfelPLHistoryModelTid) private _plHistoryModel: Newable<typeof DPortfelPLHistoryModel>,
  ) {}

  summary(opts: IAsynXOpts<IDPortfelAdapter['summary']>, props: IDPortfelSummaryModelProps) {
    const source = new AsynX(this._adapter.summary.bind(this._adapter), opts);
    return new MapX.DList(source, () => source.data?.data, lv => new this._summaryModel(lv, props));
  }

  plByInstrument(opts: IAsynXOpts<IDPortfelAdapter['plByInstrument']>, props: IDPortfelPLByInstrumentModelProps) {
    const source = new AsynX(this._adapter.plByInstrument.bind(this._adapter), opts);
    return new MapX.DList(source, () => source.data?.data, lv => new this._byInstrumentModel(lv, props));
  }

  yieldHistory(opts: IAsynXOpts<IDPortfelAdapter['yieldHistory']>) {
    const source = new AsynX(this._adapter.yieldHistory.bind(this._adapter), opts);
    return new MapX.DList(source, () => source.data?.data, lv => new this._yieldHistoryModel(lv));
  }

  mvHistory(opts: IAsynXOpts<IDPortfelAdapter['mvHistory']>) {
    const source = new AsynX(this._adapter.mvHistory.bind(this._adapter), opts);
    return new MapX.DList(source, () => source.data?.data, lv => new this._mvHistoryModel(lv));
  }

  plHistory(opts: IAsynXOpts<IDPortfelAdapter['plHistory']>) {
    const source = new AsynX(this._adapter.plHistory.bind(this._adapter), opts);
    return new MapX.DList(source, () => source.data?.data, lv => new this._plHistoryModel(lv));
  }
}
