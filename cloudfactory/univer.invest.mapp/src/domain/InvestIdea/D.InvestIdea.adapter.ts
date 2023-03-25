import { IDInvestIdeaAdapter } from '@invest.wl/domain/src/InvestIdea/D.InvestIdea.types';
import {
  IDInvestIdeaInfoRequestDTO, IDInvestIdeaInfoResponseDTO, IDInvestIdeaItemDTO, IDInvestIdeaListRequestDTO,
  IDInvestIdeaListResponseDTO,
} from '@invest.wl/core/src/dto/InvestIdea';
import { Inject, Injectable } from '@invest.wl/core/src/di/IoC';
import {
  STransportReportService, STransportReportServiceTid,
} from '@invest.wl/system/src/Transport/Report/S.TransportReport.service';
import { DInstrumentId } from '@invest.wl/domain/src/Instrument/model/D.InstrumentId.model';
import { IApiResponse } from '@invest.wl/core/src/types/base.types';

@Injectable()
export class DInvestIdeaAdapter implements IDInvestIdeaAdapter {
  constructor(
    @Inject(STransportReportServiceTid) private _reportTp: STransportReportService,
  ) {}

  public list(req: IDInvestIdeaListRequestDTO): Promise<IApiResponse<IDInvestIdeaListResponseDTO>> {
    return this._reportTp.InvestIdeaList({
      instrumentId: req.instrumentId as any, currencies: req.currencies?.join(','),
      offset: req.offset, pagesize: req.pageSize, type: req.type,
      order: req.order ? `${req.order.field} ${req.order.direction}` : undefined,
    })
      .then(res => ({
        code: 0, data: res.map(i => ({
          ...i, id: i.InvestIdeaId.toString(),
          Instrument: i.Instrument ? {
            ...i.Instrument, SecureCode: i.Instrument.SecurCode,
            IsFavorite: i.IsFavorite,
            id: new DInstrumentId({
              id: i.Instrument.InstrumentId.toString(), secureCode: i.Instrument.SecurCode,
              classCode: i.Instrument.ClassCode,
            }),
          } : undefined,
        } as IDInvestIdeaItemDTO)),
      }));
  }

  public info(req: IDInvestIdeaInfoRequestDTO): Promise<IApiResponse<IDInvestIdeaInfoResponseDTO>> {
    return this._reportTp.InvestIdeaList({ investIdeaId: req.id as any })
      .then(res => {
        const i = res[0];
        return {
          code: 0, data: ({
            ...i, id: i.InvestIdeaId.toString(),
            Instrument: i.Instrument ? {
              ...i.Instrument, SecureCode: i.Instrument.SecurCode,
              IsFavorite: i.IsFavorite,
              id: new DInstrumentId({
                id: i.Instrument.InstrumentId.toString(), secureCode: i.Instrument.SecurCode,
                classCode: i.Instrument.ClassCode,
              }),
            } : undefined,
          } as IDInvestIdeaInfoResponseDTO),
        };
      });
  }
}
