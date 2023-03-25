import {
  IApiResponse,
  IDOperationDepositCreateDTO,
  IDOperationDepositResponseDTO,
  IDOperationItemDTO,
  IDOperationListRequestDTO,
  IDOperationListResponseDTO,
  Inject,
  Injectable,
} from '@invest.wl/core';
import { IDOperationAdapter } from '@invest.wl/domain/src/Operation/D.Operation.types';
import { ISErrorService, SErrorServiceTid } from '@invest.wl/system/src/Error/S.Error.types';
import { STransportReportService, STransportReportServiceTid } from '@invest.wl/system/src/Transport/Report/S.TransportReport.service';
import { STransportTransferService, STransportTransferServiceTid } from '@invest.wl/system/src/Transport/Transfer/S.TransportTransfer.service';

@Injectable()
export class DOperationAdapter implements IDOperationAdapter {
  constructor(
    @Inject(STransportReportServiceTid) private _reportTp: STransportReportService,
    @Inject(STransportTransferServiceTid) private _transferTp: STransportTransferService,
    @Inject(SErrorServiceTid) private _errorService: ISErrorService,
  ) {}

  public List(req: IDOperationListRequestDTO): Promise<IApiResponse<IDOperationListResponseDTO>> {
    return this._reportTp.NonTradeOperation({
      accounts: req.accountIdList?.join(','),
      offset: req.offset, pageSize: req.pageSize,
    })
      .then(res => {
        // TODO: check o.AssetType
        return {
          code: 0,
          message: 'ok',
          data: res.map(o => ({
            ...o, id: o.OperationId.toString(), TS: o.ts,
            Instrument: {
              ...o.Instrument, id: o.Instrument.Id.toString(),
              secureCode: o.Instrument.Ticker,
              AssetType: o.AssetType, AssetSubType: o.SubType,
            },
            LinkInstrument: {
              ...o.LinkInstrument, id: o.LinkInstrument.Id.toString(),
              secureCode: o.LinkInstrument.Ticker,
              AssetType: o.AssetType, AssetSubType: o.SubType,
            },
            Agreement: {
              ...o.Client,
              id: o.Client.ClientId.toString(),
            },
            Account: {
              ...o.Account,
              id: o.Account.AccountId.toString(),
            },
          } as IDOperationItemDTO)),
        };
      });
  }

  public DepositCreate(req: IDOperationDepositCreateDTO): Promise<IDOperationDepositResponseDTO> {
    return this._transferTp.Deposit({
      sum: req.total,
      contractNumber: req.agreement,
      tradeCode: req.account,
    }).then(r => {
      if (!r.success) {
        throw this._errorService.httpHandle({
          message: r.errorDesc, status: r.errorCode, httpStatus: 200, body: r, url: '',
        });
      }
      return { ...r, commission: r.fee };
    });
  }
}
