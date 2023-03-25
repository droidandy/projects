import {
  IApiResponse,
  IDNewsInfoRequestDTO,
  IDNewsInfoResponseDTO,
  IDNewsItemDTO,
  IDNewsListRequestDTO,
  IDNewsListResponseDTO,
  Inject,
  Injectable,
} from '@invest.wl/core';
import { DInstrumentId } from '@invest.wl/domain/src/Instrument/model/D.InstrumentId.model';
import { IDNewsAdapter } from '@invest.wl/domain/src/News/D.News.types';
import { STransportReportService, STransportReportServiceTid } from '@invest.wl/system/src/Transport/Report/S.TransportReport.service';

@Injectable()
export class DNewsAdapter implements IDNewsAdapter {
  constructor(
    @Inject(STransportReportServiceTid) private _reportTp: STransportReportService,
  ) {}

  public list(req: IDNewsListRequestDTO): Promise<IApiResponse<IDNewsListResponseDTO>> {
    return this._reportTp.NewsList({
      instrumentId: req.instrumentId as any, suggestId: req.suggestId as any,
      offset: req.offset, pageSize: req.pageSize,
    })
      .then(res => ({
        code: 0, data: res.map(i => ({
          ...i, id: i.NewsId.toString(),
          Instrument: i.Instrument ? {
            ...i.Instrument, SecureCode: i.Instrument.SecurCode,
            IsFavorite: false,
            id: new DInstrumentId({
              id: i.Instrument.InstrumentId.toString(), secureCode: i.Instrument.SecurCode,
              classCode: i.Instrument.ClassCode,
            }),
          } : undefined,
        } as IDNewsItemDTO)),
      }));
  }

  public info(req: IDNewsInfoRequestDTO): Promise<IApiResponse<IDNewsInfoResponseDTO>> {
    return this._reportTp.NewsList({ newsId: req.id as any })
      .then(res => {
        const i = res[0];
        return {
          code: 0, data: ({
            ...i, id: i.NewsId.toString(),
            Instrument: i.Instrument ? {
              ...i.Instrument, SecureCode: i.Instrument.SecurCode,
              IsFavorite: false,
              id: new DInstrumentId({
                id: i.Instrument.InstrumentId.toString(), secureCode: i.Instrument.SecurCode,
                classCode: i.Instrument.ClassCode,
              }),
            } : undefined,
          } as IDNewsInfoResponseDTO),
        };
      });
  }
}
