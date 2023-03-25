import { IDOperationAdapter } from '@invest.wl/domain/src/Operation/D.Operation.types';
import {
  IDOperationDepositCreateDTO, IDOperationDepositResponseDTO,
  IDOperationItemDTO, IDOperationListRequestDTO, IDOperationListResponseDTO,
} from '@invest.wl/core/src/dto/Operation';
import { Inject, Injectable } from '@invest.wl/core/src/di/IoC';
import {
  STransportReportService, STransportReportServiceTid,
} from '@invest.wl/system/src/Transport/Report/S.TransportReport.service';
import { IApiResponse } from '@invest.wl/core/src/types/base.types';

@Injectable()
export class DOperationAdapter implements IDOperationAdapter {
  constructor(
    @Inject(STransportReportServiceTid) private _reportTp: STransportReportService,
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
    throw new Error('not implemented');
  }
}
