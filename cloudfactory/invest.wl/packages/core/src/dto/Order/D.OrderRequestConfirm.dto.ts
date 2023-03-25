import { TModelId } from '../../types';

export interface IDOrderRequestConfirmRequestDTO {
  orderRequestId: TModelId;
  // sms code
  code: string;
  agreementId?: TModelId;
}

export interface IDOrderRequestConfirmResponseDTO {
  // id = OrderId: number;
  id: TModelId;
}
