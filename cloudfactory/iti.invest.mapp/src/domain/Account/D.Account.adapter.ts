import { IDAccountAdapter } from '@invest.wl/domain/src/Account/D.Account.types';
import {
  IDAccountAgreementCreateCodeResendRequestDTO, IDAccountAgreementCreateCodeResendResponseDTO,
  IDAccountAgreementCreateConfirmRequestDTO, IDAccountAgreementCreateConfirmResponseDTO,
  IDAccountAgreementCreateRequestDTO, IDAccountAgreementCreateResponseDTO, IDAccountItemDTO, IDAccountListRequestDTO,
  IDAccountListResponseDTO, IDAccountQUIKItemDTO, IDAccountQUIKListRequestDTO, IDAccountQUIKListResponseDTO,
} from '@invest.wl/core/src/dto/Account';
import { Inject, Injectable } from '@invest.wl/core/src/di/IoC';
import {
  STransportTradeService, STransportTradeServiceTid,
} from '@invest.wl/system/src/Transport/Trade/S.TransportTrade.service';
import {
  STransportQUIKService, STransportQUIKServiceTid,
} from '@invest.wl/system/src/Transport/QUIK/S.TransportQUIK.service';
import { IApiResponse } from '@invest.wl/core/src/types/base.types';

@Injectable()
export class DAccountAdapter implements IDAccountAdapter {
  constructor(
    @Inject(STransportTradeServiceTid) private _tradeTp: STransportTradeService,
    @Inject(STransportQUIKServiceTid) private _quikTp: STransportQUIKService,
  ) {}

  public list(req: IDAccountListRequestDTO): Promise<IApiResponse<IDAccountListResponseDTO>> {
    return this._tradeTp.DataAccountList({
      instrumentId: req.instrumentId ? parseInt(req.instrumentId, 10) : undefined,
    }).then(res => ({
      code: 0, data: res.map(a => ({
        ...a, id: a.AccountId.toString(), Agreement: a.Client ? {
          ...a.Client, id: a.Client.ClientId.toString(),
          AgreementId: a.Client.AgreementId?.toString(),
        } : undefined,
      } as IDAccountItemDTO)),
    }));
  }

  public quikList(req: IDAccountQUIKListRequestDTO): Promise<IApiResponse<IDAccountQUIKListResponseDTO>> {
    return this._quikTp.AccountList({
      instrumentId: req.instrumentId ? parseInt(req.instrumentId, 10) : undefined,
      currencyName: req.currencyName, classcode: req.classCode, securcode: req.secureCode,
    })
      .then(res => ({
        code: 0, data: res.map(a => ({
          ...a, id: a.AccountId.toString(), Agreement: a.Client ? {
            ...a.Client, id: a.Client.ClientId.toString(),
          } : undefined,
        } as IDAccountQUIKItemDTO)),
      }));
  }

  public agreementCreate(req: IDAccountAgreementCreateRequestDTO): Promise<IApiResponse<IDAccountAgreementCreateResponseDTO>> {
    throw new Error('not implemented');
  }

  public agreementCreateCodeResend(req: IDAccountAgreementCreateCodeResendRequestDTO): Promise<IApiResponse<IDAccountAgreementCreateCodeResendResponseDTO>> {
    throw new Error('not implemented');
  }

  public agreementCreateConfirm(req: IDAccountAgreementCreateConfirmRequestDTO): Promise<IApiResponse<IDAccountAgreementCreateConfirmResponseDTO>> {
    throw new Error('not implemented');
  }
}
