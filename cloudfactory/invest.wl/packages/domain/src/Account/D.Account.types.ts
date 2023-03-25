import {
  IApiResponse,
  IDAccountAgreementCreateCodeResendRequestDTO,
  IDAccountAgreementCreateCodeResendResponseDTO,
  IDAccountAgreementCreateConfirmRequestDTO,
  IDAccountAgreementCreateConfirmResponseDTO,
  IDAccountAgreementCreateRequestDTO,
  IDAccountAgreementCreateResponseDTO,
  IDAccountListRequestDTO,
  IDAccountListResponseDTO,
  IDAccountQUIKListRequestDTO,
  IDAccountQUIKListResponseDTO,
} from '@invest.wl/core';

export const DAccountAdapterTid = Symbol.for('DAccountAdapterTid');

export interface IDAccountAdapter {
  list(req: IDAccountListRequestDTO): Promise<IApiResponse<IDAccountListResponseDTO>>;
  quikList(req: IDAccountQUIKListRequestDTO): Promise<IApiResponse<IDAccountQUIKListResponseDTO>>;
  agreementCreate(req: IDAccountAgreementCreateRequestDTO): Promise<IApiResponse<IDAccountAgreementCreateResponseDTO>>;
  agreementCreateCodeResend(req: IDAccountAgreementCreateCodeResendRequestDTO): Promise<IApiResponse<IDAccountAgreementCreateCodeResendResponseDTO>>;
  agreementCreateConfirm(req: IDAccountAgreementCreateConfirmRequestDTO): Promise<IApiResponse<IDAccountAgreementCreateConfirmResponseDTO>>;
}
