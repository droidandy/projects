import { IDInstrumentAlertAdapter } from '@invest.wl/domain/src/InstrumentAlert/D.InstrumentAlert.types';
import {
  IDInstrumentAlertCountRequestDTO, IDInstrumentAlertCountResponseDTO, IDInstrumentAlertListDeleteRequestDTO,
  IDInstrumentAlertListDeleteResponseDTO, IDInstrumentAlertListRequestDTO, IDInstrumentAlertListResponseDTO,
  IDInstrumentAlertSetRequestDTO, IDInstrumentAlertSetResponseDTO, IDInstrumentAlertViewedUpdateRequestDTO,
  IDInstrumentAlertViewedUpdateResponseDTO,
} from '@invest.wl/core/src/dto/InstrumentAlert';
import { Inject, Injectable } from '@invest.wl/core/src/di/IoC';
import {
  STransportDataService, STransportDataServiceTid,
} from '@invest.wl/system/src/Transport/Data/S.TransportData.service';
import { DInstrumentId } from '@invest.wl/domain/src/Instrument/model/D.InstrumentId.model';
import { IApiResponse } from '@invest.wl/core/src/types/base.types';
import { ISConfigStore, SConfigStoreTid } from '@invest.wl/system/src/Config/S.Config.types';

@Injectable()
export class DInstrumentAlertAdapter implements IDInstrumentAlertAdapter {
  constructor(
    @Inject(STransportDataServiceTid) private _dataTp: STransportDataService,
    @Inject(SConfigStoreTid) private _cfg: ISConfigStore,
  ) {}

  public count(req: IDInstrumentAlertCountRequestDTO): Promise<IApiResponse<IDInstrumentAlertCountResponseDTO>> {
    return this._dataTp.NotificationCount(req).then(res => ({ data: { value: res.Value }, code: 0 }));
  }

  public set(req: IDInstrumentAlertSetRequestDTO): Promise<IApiResponse<IDInstrumentAlertSetResponseDTO>> {
    return this._dataTp.AlertSave({
      alertId: parseInt(req.id, 10),
      classCode: req.classCode, securCode: req.secureCode,
      instrumentId: parseInt(req.instrumentId, 10), targetPrice: req.targetPrice,
    }).then(res => ({ code: 0, data: { AlertId: res.AlertId.toString() } }));
  }

  public list(req: IDInstrumentAlertListRequestDTO): Promise<IApiResponse<IDInstrumentAlertListResponseDTO>> {
    return this._dataTp.AlertList({
      instrumentId: req.instrumentId ? parseInt(req.instrumentId, 10) : undefined,
      classCode: req.classCode, secureCode: req.secureCode,
      offset: req.offset, pageSize: req.pageSize, status: req.status,
    }).then(res => ({
      code: 0, data: res.map(a => ({
        ...a, id: a.AlertId.toString(),
        Instrument: {
          ...a.Instrument, id: new DInstrumentId({
            id: a.Instrument.InstrumentId.toString(), classCode: a.Instrument.ClassCode,
            secureCode: a.Instrument.SecureCode,
          }),
          Currency: a.Currency, PriceStep: a.PriceStep,
        },
      })),
    }));
  }

  public listDelete(req: IDInstrumentAlertListDeleteRequestDTO): Promise<IApiResponse<IDInstrumentAlertListDeleteResponseDTO>> {
    return this._dataTp.AlertDeleteMany({ alertIds: req.idList.map(id => parseInt(id, 10)) }).then(res => ({
      code: 0, data: res,
    }));
  }

  public viewedUpdate(req: IDInstrumentAlertViewedUpdateRequestDTO): Promise<IApiResponse<IDInstrumentAlertViewedUpdateResponseDTO>> {
    return this._dataTp.AlertMarkViewed({ alertId: req.idList.join(',') }).then(res => ({ code: 0, data: res }));
  }

  public get updateInterval() {
    return this._cfg.instrumentAlertUpdateInterval;
  }
}
