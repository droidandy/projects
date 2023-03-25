import {
  IApiResponse,
  IDCustomerAccountSelfRequestDTO,
  IDCustomerAccountSelfResponseDTO,
  IDCustomerCreateSelfCodeResendRequestDTO,
  IDCustomerCreateSelfCodeResendResponseDTO,
  IDCustomerCreateSelfConfirmRequestDTO,
  IDCustomerCreateSelfConfirmResponseDTO,
  IDCustomerCreateSelfRequestDTO,
  IDCustomerCreateSelfResponseDTO,
  IDCustomerPreferenceSetRequestDTO,
  IDCustomerPreferenceSetResponseDTO,
} from '@invest.wl/core';

export const DCustomerAdapterTid = Symbol.for('DCustomerAdapterTid');

export interface IDCustomerAdapter {
  accountSelf(req: IDCustomerAccountSelfRequestDTO): Promise<IApiResponse<IDCustomerAccountSelfResponseDTO>>;
  preferenceSet(req: IDCustomerPreferenceSetRequestDTO): Promise<IApiResponse<IDCustomerPreferenceSetResponseDTO>>;
  createSelf(req: IDCustomerCreateSelfRequestDTO): Promise<IApiResponse<IDCustomerCreateSelfResponseDTO>>;
  createSelfCodeResend(req: IDCustomerCreateSelfCodeResendRequestDTO): Promise<IApiResponse<IDCustomerCreateSelfCodeResendResponseDTO>>;
  createSelfConfirm(req: IDCustomerCreateSelfConfirmRequestDTO): Promise<IApiResponse<IDCustomerCreateSelfConfirmResponseDTO>>;
}

export const DCustomerStoreTid = Symbol.for('DCustomerStoreTid');
export const DCustomerGatewayTid = Symbol.for('DCustomerGatewayTid');
