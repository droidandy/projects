import {
  IApiResponse,
  IDOrderCancelRequestDTO,
  IDOrderCancelResponseDTO,
  IDOrderIdCreateRequestDTO,
  IDOrderIdCreateResponseDTO,
  IDOrderInfoRequestDTO,
  IDOrderInfoResponseDTO,
  IDOrderItemDTO,
  IDOrderListRequestDTO,
  IDOrderListResponseDTO,
  IDOrderRequestConfirmRequestDTO,
  IDOrderRequestConfirmResponseDTO,
  IDOrderRequestCreateRequestDTO,
  IDOrderRequestCreateResponseDTO,
  Inject,
  Injectable,
} from '@invest.wl/core';
import { DInstrumentId } from '@invest.wl/domain/src/Instrument/model/D.InstrumentId.model';
import { IDOrderAdapter } from '@invest.wl/domain/src/Order/D.Order.types';
import { ISConfigStore, SConfigStoreTid } from '@invest.wl/system/src/Config/S.Config.types';
import { STransportReportService, STransportReportServiceTid } from '@invest.wl/system/src/Transport/Report/S.TransportReport.service';
import { STransportTradeService, STransportTradeServiceTid } from '@invest.wl/system/src/Transport/Trade/S.TransportTrade.service';

@Injectable()
export class DOrderAdapter implements IDOrderAdapter {
  constructor(
    @Inject(STransportReportServiceTid) private _reportTp: STransportReportService,
    @Inject(STransportTradeServiceTid) private _tradeTp: STransportTradeService,
    @Inject(SConfigStoreTid) private _cfg: ISConfigStore,
  ) {}

  public list(req: IDOrderListRequestDTO): Promise<IApiResponse<IDOrderListResponseDTO>> {
    const { accountIdList, agreementIdList, orderTypeList, pageSize, ...rq } = req;
    return this._reportTp.PortfelTableOrder({
      ...rq,
      instrumentId: req.instrumentId ? parseInt(req.instrumentId, 10) : undefined,
      orderTypes: orderTypeList?.join(','), pagesize: pageSize,
      accounts: accountIdList?.join(','), clients: agreementIdList.join(','),
    })
      .then(res => {
        return {
          code: 0, message: 'ok', data: res.map(o => ({
            ...o, id: o.OrderId.toString(), AgreementId: o.Client,
            Account: { id: o.AccountId.toString(), name: o.Account },
            Instrument: {
              ...o.Instrument,
              id: new DInstrumentId({
                id: o.Instrument.InstrumentId.toString(), secureCode: o.Instrument.SecurCode,
                classCode: o.Instrument.ClassCode,
              }), SecureCode: o.Instrument.SecurCode,
            },
          } as IDOrderItemDTO)),
        };
      });
  }

  public info(req: IDOrderInfoRequestDTO): Promise<IApiResponse<IDOrderInfoResponseDTO>> {
    return this._tradeTp.DataOrder({ orderId: parseInt(req.id, 10) }).then(res => ({
      code: 0, data: {
        ...res, id: res.OrderId.toString(), ExchangeStatus: res.ExchStatus, Instrument: {
          id: new DInstrumentId({
            id: res.InstrumentId.toString(), secureCode: res.Ticker, classCode: res.ClassCode,
          }),
          AssetType: res.AssetType, AssetSubType: res.AssetSubType,
          ClassCode: res.ClassCode, SecureCode: res.Ticker,
        },
        AccountId: res.AccountId.toString(),
        TradeAccountMapId: res.TradeAccountMapId,
      },
    }));
  }

  public cancel(req: IDOrderCancelRequestDTO): Promise<IApiResponse<IDOrderCancelResponseDTO>> {
    return this._tradeTp.DoCancelOrder({ orderId: parseInt(req.id, 10) })
      .then(res => ({ code: 0, data: res }));
  }

  public idCreate(req: IDOrderIdCreateRequestDTO): Promise<IApiResponse<IDOrderIdCreateResponseDTO>> {
    return this._tradeTp.OrderGetNewId(req).then(res => ({ code: 0, data: { id: res.OrderId } }));
  }

  public requestCreate(req: IDOrderRequestCreateRequestDTO): Promise<IApiResponse<IDOrderRequestCreateResponseDTO>> {
    return this._tradeTp.OrderSaveRequest({
      ...req, orderId: parseInt(req.id, 10), accountId: parseInt(req.accountId, 10),
      instrumentId: parseInt(req.instrument.id, 10), ticker: req.instrument.secureCode,
      classcode: req.instrument.classCode,
    }).then(res => ({ code: 0, data: res }));
  }

  public requestConfirm(req: IDOrderRequestConfirmRequestDTO): Promise<IApiResponse<IDOrderRequestConfirmResponseDTO>> {
    return this._tradeTp.DoConfirmOrderRequest(req)
      .then(res => ({ code: 0, data: { id: res.OrderId.toString() } }));
  }

  public get cancelCheckTimeout() {
    return this._cfg.instrumentQuoteListUpdateInterval || 10000;
  }

  public get cancelInterval() {
    return 1000;
  }

  public get createCheckInterval() {
    return 1000;
  }

  public get createCheckTimeout() {
    return 10000;
  }

  public get createCodeLength() {
    return 4;
  }

  public get createCodeResendInterval() {
    return 180;
  }
}
