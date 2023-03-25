import {
  EDInstrumentAssetType,
  EDTradeDirection,
  IApiResponse,
  IDInstrumentExchangeOptsDTO,
  IDInstrumentExchangeRequestDTO,
  IDInstrumentFavoriteUserUpdateRequestDTO,
  IDInstrumentFavoriteUserUpdateResponseDTO,
  IDInstrumentInfoRequestDTO,
  IDInstrumentInfoResponseDTO,
  IDInstrumentMarketHistoryListRequestDTO,
  IDInstrumentMarketHistoryListResponseDTO,
  IDInstrumentQuoteItemDTO,
  IDInstrumentQuoteListRequestDTO,
  IDInstrumentQuoteListResponseDTO,
  IDInstrumentSearchItemDTO,
  IDInstrumentSearchRequestDTO,
  IDInstrumentSearchResponseDTO,
  IDInstrumentSummaryRequestDTO,
  IDInstrumentSummaryResponseDTO,
  Inject,
  Injectable,
} from '@invest.wl/core';
import { IDInstrumentAdapter } from '@invest.wl/domain/src/Instrument/D.Instrument.types';
import { DInstrumentId } from '@invest.wl/domain/src/Instrument/model/D.InstrumentId.model';

import { ISConfigStore, SConfigStoreTid } from '@invest.wl/system/src/Config/S.Config.types';
import { STransportDataService, STransportDataServiceTid } from '@invest.wl/system/src/Transport/Data/S.TransportData.service';
import { STransportMarketService, STransportMarketServiceTid } from '@invest.wl/system/src/Transport/Market/S.TransportMarket.service';
import { STransportReportService, STransportReportServiceTid } from '@invest.wl/system/src/Transport/Report/S.TransportReport.service';
import { STransportTradeService, STransportTradeServiceTid } from '@invest.wl/system/src/Transport/Trade/S.TransportTrade.service';
import { STransportWsService, STransportWsServiceTid } from '@invest.wl/system/src/Transport/Ws/S.TransportWs.service';

@Injectable()
export class DInstrumentAdapter implements IDInstrumentAdapter {
  constructor(
    @Inject(STransportDataServiceTid) private _dataTp: STransportDataService,
    @Inject(STransportReportServiceTid) private _reportTp: STransportReportService,
    @Inject(STransportMarketServiceTid) private _marketTp: STransportMarketService,
    @Inject(STransportTradeServiceTid) private _tradeTp: STransportTradeService,
    @Inject(STransportWsServiceTid) private _wsTp: STransportWsService,
    @Inject(SConfigStoreTid) private _cfg: ISConfigStore,
  ) {}

  public get quoteListUpdateInterval() {
    return this._cfg.instrumentQuoteListUpdateInterval;
  }

  public get summaryUpdateInterval() {
    return 3000;
  }

  public get searchInputDelay() {
    return 1000;
  }

  public get searchTextMinLength() {
    return 3;
  }

  public exchangeList(opts: IDInstrumentExchangeOptsDTO) {
    const source = this._wsTp.ob2({
      ttl: 10000, ...opts, onUpdate: (list) => {
        opts.onUpdate(list.map(quote => ({
          id: quote.p.toString(), instrumentId: quote.i, volume: quote.v, price: quote.p, time: quote.t,
        })));
      },
    });
    return {
      request: (req: IDInstrumentExchangeRequestDTO) => source
        .request({ Instruments: [`${req.id.secureCode}@${req.id.classCode}`], ProtoVersion: 1 })
        .then(res => ({
          code: 0, data: res.map(item => ({
            id: item.p.toString(), instrumentId: item.i.toString(),
            price: item.p, volume: item.v, time: item.t,
          })),
        })),
      dispose: () => source.dispose(),
    };
  }

  public favoriteUserUpdate(req: IDInstrumentFavoriteUserUpdateRequestDTO): Promise<IApiResponse<IDInstrumentFavoriteUserUpdateResponseDTO>> {
    return this._dataTp.InstrumentIsFavorite({
      instrumentId: parseInt(req.id, 10), isFavorite: req.isFavorite, classCode: req.classCode,
      securCode: req.secureCode,
    }).then(res => ({ code: 0, data: res }));
  }

  public info(req: IDInstrumentInfoRequestDTO): Promise<IApiResponse<IDInstrumentInfoResponseDTO>> {
    return this._tradeTp.DataInstrument({
      classcode: req.classCode, instrumentId: parseInt(req.id, 10), ticker: req.secureCode,
    })
      .then(i => ({
        code: 0, data: ({
          ...i,
          id: new DInstrumentId({ id: i.InstrumentId.toString(), secureCode: i.SecurCode, classCode: i.ClassCode }),
          SecureCode: i.SecurCode,
          AssetType: i.AssetType.AssetTypeId, AssetTypeName: i.AssetType.Name,
          AssetSubType: i.AssetSubType.AssetSubTypeId, AssetSubTypeName: i.AssetSubType.Name,
          Updated: new Date(i.Updated), TradeFloorId: i.TradeFloorId.toString(),
          // для облигаций перепутаны MidRate = MidRateMoney
          MidRate: i.AssetType.AssetTypeId === EDInstrumentAssetType.Bond ? i.MidRateMoney : i.MidRate,
          MidRatePercent: i.AssetType.AssetTypeId === EDInstrumentAssetType.Bond ? i.MidRate : i.MidRateMoney,
        } as IDInstrumentInfoResponseDTO),
      }));
  }

  public marketHistoryList(req: IDInstrumentMarketHistoryListRequestDTO): Promise<IApiResponse<IDInstrumentMarketHistoryListResponseDTO>> {
    return this._marketTp.History({
      classCode: req.classCode, secCode: req.secureCode,
      from: req.dateFrom, to: req.dateTo, length: req.gap, mode: req.mode,
      offset: req.offset, pagesize: req.pageSize,
    }).then(res => {
      return {
        code: 0, data: {
          Results: (res.results || []).map(r => ({
            id: r.statement_id.toString(),
            Series: r.series.map(s => ({ Columns: s.columns, Name: s.name, Values: s.values })),
          })),
        },
      };
    });
  }

  public quoteList(req: IDInstrumentQuoteListRequestDTO): Promise<IApiResponse<IDInstrumentQuoteListResponseDTO>> {
    return this._reportTp.InstrumentQuoteFeed({
      offset: req.offset, order: req.order ? `${req.order.field} ${req.order.direction}` : undefined,
      pageSize: req.pageSize, type: req.type, showParams: req.showParams,
    }).then(res => ({
      code: 0, data: res.map(q => ({
        ...q, id: new DInstrumentId({ id: q.InstrumentId.toString(), secureCode: q.SecurCode, classCode: q.ClassCode }),
        SecureCode: q.SecurCode,
        MaturityDate: q.MaturityDate && new Date(q.MaturityDate),
        Order: { ...q.Order, BS: q.Order.BS === 'B' ? EDTradeDirection.Buy : EDTradeDirection.Sell },
        // для облигаций перепутаны MidRate = MidRateMoney
        MidRate: q.AssetType === EDInstrumentAssetType.Bond ? q.MidRateMoney : q.MidRate,
        MidRatePercent: q.AssetType === EDInstrumentAssetType.Bond ? q.MidRate : q.MidRateMoney,
        Perpetual: q.Perpetual,
      } as IDInstrumentQuoteItemDTO)),
    }));
  }

  public search(req: IDInstrumentSearchRequestDTO): Promise<IApiResponse<IDInstrumentSearchResponseDTO>> {
    return this._reportTp.InstrumentSearch({ text: req.text }).then(res => ({
      code: 0, data: res.map(i => ({
        ...i, id: new DInstrumentId({ id: i.InstrumentId.toString(), secureCode: i.SecurCode, classCode: i.ClassCode }),
        SecureCode: i.SecurCode,
        MaturityDate: i.MaturityDate && new Date(i.MaturityDate),
        TradeFloorId: i.TradeFloorId.toString(),
      } as IDInstrumentSearchItemDTO)),
    }));
  }

  public summary(req: IDInstrumentSummaryRequestDTO): Promise<IApiResponse<IDInstrumentSummaryResponseDTO>> {
    return this._reportTp.InstrumentSummary({
      classcode: req.classCode, instrumentId: parseInt(req.id, 10), securcode: req.secureCode,
    }).then(res => ({
      code: 0, data: {
        ...res, id: res.Instrument.InstrumentId.toString(), Instrument: {
          id: new DInstrumentId({
            id: res.Instrument.InstrumentId.toString(), secureCode: res.Instrument.SecurCode,
            classCode: res.Instrument.ClassCode,
          }),
          ...res.Instrument, SecureCode: res.Instrument.SecurCode,
          // для облигаций перепутаны MidRate = MidRateMoney
          MidRate: res.Instrument.AssetType === EDInstrumentAssetType.Bond ? res.Instrument.MidRateMoney : res.Instrument.MidRate,
          MidRatePercent: res.Instrument.AssetType === EDInstrumentAssetType.Bond ? res.Instrument.MidRate : res.Instrument.MidRateMoney,
        },
      },
    }));
  }
}
