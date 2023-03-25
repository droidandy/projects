import { IDPortfelAdapter } from '@invest.wl/domain/src/Portfel/D.Portfel.types';
import {
  IDPortfelMVHistoryRequestDTO, IDPortfelMVHistoryResponseDTO, IDPortfelPLByInstrumentItemDTO,
  IDPortfelPLByInstrumentRequestDTO, IDPortfelPLByInstrumentResponseDTO, IDPortfelPLHistoryRequestDTO,
  IDPortfelPLHistoryResponseDTO, IDPortfelSummaryRequestDTO, IDPortfelSummaryResponseDTO,
  IDPortfelYieldHistoryRequestDTO, IDPortfelYieldHistoryResponseDTO,
} from '@invest.wl/core/src/dto/Portfel';
import { Inject, Injectable } from '@invest.wl/core/src/di/IoC';
import {
  STransportReportService, STransportReportServiceTid,
} from '@invest.wl/system/src/Transport/Report/S.TransportReport.service';
import {
  STransportQUIKService, STransportQUIKServiceTid,
} from '@invest.wl/system/src/Transport/QUIK/S.TransportQUIK.service';
import { EDAccountMarketType } from '@invest.wl/core/src/dto/Account';
import { DInstrumentId } from '@invest.wl/domain/src/Instrument/model/D.InstrumentId.model';
import { IApiResponse } from '@invest.wl/core/src/types/base.types';
import { ISConfigStore, SConfigStoreTid } from '@invest.wl/system/src/Config/S.Config.types';

@Injectable()
export class DPortfelAdapter implements IDPortfelAdapter {
  constructor(
    @Inject(SConfigStoreTid) private _cfg: ISConfigStore,
    @Inject(STransportReportServiceTid) private _reportTp: STransportReportService,
    @Inject(STransportQUIKServiceTid) private _quikTp: STransportQUIKService,
  ) {}

  public yieldHistory(req: IDPortfelYieldHistoryRequestDTO): Promise<IApiResponse<IDPortfelYieldHistoryResponseDTO>> {
    return this._reportTp.PortfelChart({
      ...req, accounts: req.accountIdList?.join(','), clients: '-1',
    }).then(res => ({
      code: 0, data: res.map((i, index) => ({
        ...i, id: index.toString(), Date: new Date(i.Date),
      })),
    }));
  }

  public mvHistory(req: IDPortfelMVHistoryRequestDTO): Promise<IApiResponse<IDPortfelMVHistoryResponseDTO>> {
    return this._reportTp.PortfelMVChart({
      ...req, accounts: req.accountIdList?.join(','),
    }).then(res => ({
      code: 0, data: res.map((i, index) => ({
        ...i, id: index.toString(), Date: new Date(i.Date),
        Agreement: i.Client,
      })),
    }));
  }

  public plHistory(req: IDPortfelPLHistoryRequestDTO): Promise<IApiResponse<IDPortfelPLHistoryResponseDTO>> {
    return this._reportTp.PortfelMVChart({
      ...req, accounts: req.accountIdList?.join(','),
    }).then(res => ({
      code: 0, data: res.map((i, index) => ({
        ...i, id: index.toString(), Date: new Date(i.Date),
        Agreement: i.Client,
      })),
    }));
  }

  public plByInstrument(req: IDPortfelPLByInstrumentRequestDTO): Promise<IApiResponse<IDPortfelPLByInstrumentResponseDTO>> {
    return this._quikTp.PortfelPLByInstrument({
      ...req, instrumentId: req.instrumentId ? parseInt(req.instrumentId, 10) : undefined,
      accounts: req.accountIdList?.join(','), clients: req.agreementIdList.join(','),
    }).then(res => ({
      code: 0, data: res.map((pl) => ({
        ...pl, id: `${pl.Instrument?.InstrumentId ?? ''}@${pl.Account.AccountId}`,
        Agreement: pl.Client,
        Instrument: {
          ...pl.Instrument, SecureCode: pl.Instrument?.Ticker,
          AssetType: pl.AssetType, AssetSubType: pl.AssetSubType,
          id: pl.Instrument ? new DInstrumentId({
            id: pl.Instrument.InstrumentId!.toString(), secureCode: pl.Instrument.Ticker,
            classCode: pl.Instrument.ClassCode,
          }) : undefined,
        },
        Account: { ...pl.Account, id: pl.Account.AccountId.toString(), MarketType: pl.Account.Type },
      } as IDPortfelPLByInstrumentItemDTO)),
    }));
  }

  public summary(req: IDPortfelSummaryRequestDTO): Promise<IApiResponse<IDPortfelSummaryResponseDTO>> {
    return this._quikTp.PortfelSummary({
      ...req, accounts: req.accountIdList?.join(','), clients: req.agreementIdList.join(','),
    }).then(res => ({
      code: 0, data: res.map((s) => ({
        ...s, id: s.Account.AccountId.toString(),
        Account: {
          ...s.Account, id: s.Account.AccountId.toString(), MarketType: s.Account.Type as EDAccountMarketType,
        },
        // TODO: agreement?
        Agreement: { Name: '' },
        VarMargin: s.Varmargin,
      })),
    }));
  }

  public get plUpdateInterval() {
    return this._cfg.portfelPlUpdateInterval;
  }
}
