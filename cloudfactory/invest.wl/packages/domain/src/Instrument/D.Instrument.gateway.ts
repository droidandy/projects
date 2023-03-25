import { AsynX, IAsynXOpts, IAsynXPagedOpts, MapX, numberIsZero, numberNearZero } from '@invest.wl/common';
import { IDInstrumentFavoriteUserUpdateRequestDTO, IDInstrumentQuoteItemDTO, Inject, Injectable, Newable } from '@invest.wl/core';
import { runInAction } from 'mobx';
import { DInstrumentAdapterTid, IDInstrumentAdapter } from './D.Instrument.types';
import { DInstrumentExchangeListModel, DInstrumentExchangeListModelTid, IDInstrumentExchangeListModelProps } from './model/D.InstrumentExchangeList.model';
import { DInstrumentInfoModel, DInstrumentInfoModelTid } from './model/D.InstrumentInfo.model';
import { DInstrumentMarketHistoryModel, DInstrumentMarketHistoryModelTid, IDInstrumentMarketHistoryModelProps } from './model/D.InstrumentMarketHistory.model';
import { DInstrumentQuoteModel, DInstrumentQuoteModelTid } from './model/D.InstrumentQuote.model';
import { DInstrumentSearchModel, DInstrumentSearchModelTid } from './model/D.InstrumentSearch.model';
import { DInstrumentSummaryModel, DInstrumentSummaryModelTid, IDInstrumentSummaryModelProps } from './model/D.InstrumentSummary.model';

export const DInstrumentGatewayTid = Symbol.for('DInstrumentGatewayTid');

@Injectable()
export class DInstrumentGateway {
  constructor(
    @Inject(DInstrumentAdapterTid) private _adapter: IDInstrumentAdapter,
    @Inject(DInstrumentInfoModelTid) private _infoModel: Newable<typeof DInstrumentInfoModel>,
    @Inject(DInstrumentSummaryModelTid) private _summaryModel: Newable<typeof DInstrumentSummaryModel>,
    @Inject(DInstrumentSearchModelTid) private _searchModel: Newable<typeof DInstrumentSearchModel>,
    @Inject(DInstrumentQuoteModelTid) private _quoteModel: Newable<typeof DInstrumentQuoteModel>,
    @Inject(DInstrumentExchangeListModelTid) private _glassListModel: Newable<typeof DInstrumentExchangeListModel>,
    @Inject(DInstrumentMarketHistoryModelTid) private _marketHistoryModel: Newable<typeof DInstrumentMarketHistoryModel>,
  ) {}

  public info(opts: IAsynXOpts<IDInstrumentAdapter['info']>) {
    const source = new AsynX(this._adapter.info.bind(this._adapter), opts);
    return new MapX.D(source, () => source.data?.data, lv => new this._infoModel(lv));
  }

  public summary(opts: IAsynXOpts<IDInstrumentAdapter['summary']>, props?: IDInstrumentSummaryModelProps) {
    const source = new AsynX(this._adapter.summary.bind(this._adapter), opts);
    return new MapX.D(source, () => source.data?.data, lv => new this._summaryModel(lv, props));
  }

  public search(opts: IAsynXOpts<IDInstrumentAdapter['search']>) {
    const source = new AsynX(this._adapter.search.bind(this._adapter), opts);
    return new MapX.DList(source, () => source.data?.data, lv => new this._searchModel(lv));
  }

  public quoteList(opts: IAsynXPagedOpts<IDInstrumentQuoteItemDTO, IDInstrumentAdapter['quoteList']>) {
    const source = new AsynX.Paged(this._adapter.quoteList.bind(this._adapter), opts);
    return new MapX.DList(source, () => source.data?.data, lv => new this._quoteModel(lv));
  }

  public marketHistoryList(opts: IAsynXOpts<IDInstrumentAdapter['marketHistoryList']>, modelProps: IDInstrumentMarketHistoryModelProps) {
    const source = new AsynX(this._adapter.marketHistoryList.bind(this._adapter), opts);
    return new MapX.DList(source, () => source.data?.data.Results, lv => new this._marketHistoryModel(lv, modelProps));
  }

  public exchangeList(opts: IAsynXOpts<ReturnType<IDInstrumentAdapter['exchangeList']>['request']>, modelProps: IDInstrumentExchangeListModelProps) {
    const ws = this._adapter.exchangeList({
      onUpdate(list) {
        const result = source.data?.data;
        if (!result) return;
        runInAction(() => {
          list.forEach((item) => {
            const isZero = numberIsZero(item.volume);
            const findIndex = result.findIndex((el) => Math.abs(el.price - item.price) < numberNearZero);
            if (findIndex === -1) {
              if (!isZero) result.push(item);
            } else {
              if (!isZero) result[findIndex] = item;
              else result.splice(findIndex, 1);
            }
          });
        });
      },
    });
    const source = new AsynX.Deep(ws.request, {
      ...opts, onUnobserve: ws.dispose, refreshOnObserve: true, retryOnError: 3,
    });
    return new MapX.D(source, () => source.data?.data, lv => new this._glassListModel(lv, modelProps));
  }

  public favoriteUserUpdate(req: IDInstrumentFavoriteUserUpdateRequestDTO) {
    return this._adapter.favoriteUserUpdate(req);
  }
}
