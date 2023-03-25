import { Inject, Injectable } from '@invest.wl/core/src/di/IoC';
import { IDTradeAdapter } from '@invest.wl/domain/src/Trade/D.Trade.types';
import { IDTradeItemDTO, IDTradeListRequestDTO, IDTradeListResponseDTO } from '@invest.wl/core/src/dto/Trade';
import {
  STransportReportService, STransportReportServiceTid,
} from '@invest.wl/system/src/Transport/Report/S.TransportReport.service';
import { DInstrumentId } from '@invest.wl/domain/src/Instrument/model/D.InstrumentId.model';
import { IApiResponse } from '@invest.wl/core/src/types/base.types';

@Injectable()
export class DTradeAdapter implements IDTradeAdapter {
  constructor(
    @Inject(STransportReportServiceTid) private reportTp: STransportReportService,
  ) {}

  public list(req: IDTradeListRequestDTO): Promise<IApiResponse<IDTradeListResponseDTO>> {
    const { accountIdList, agreementIdList, pageSize, ...rq } = req;
    return this.reportTp.PortfelTableTrade({
      ...rq, pagesize: pageSize,
      accounts: accountIdList?.join(','), clients: agreementIdList.join(','),
    })
      .then(res => {
        return {
          code: 0,
          data: res.map(t => ({
            ...t, id: t.TradeId.toString(), AgreementId: t.Client,
            Account: { name: t.Account },
            Instrument: {
              ...t.Instrument, SecureCode: t.Instrument.SecurCode,
              id: new DInstrumentId({
                id: t.Instrument.InstrumentId.toString(), secureCode: t.Instrument.SecurCode,
                classCode: t.Instrument.ClassCode,
              }),
            },
            BrokerFee: parseFloat(t.BrokerFee),
          } as IDTradeItemDTO)),
        };
      });
  }
}
