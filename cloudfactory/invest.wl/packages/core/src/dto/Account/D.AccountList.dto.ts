import { TModelId } from '../../types';
import { EDAccountAgreementType, IDAccountDTO } from './D.Account.dto';

export interface IDAccountListRequestDTO {
  instrumentId?: TModelId;
}

export interface IDAccountListResponseDTO extends Array<IDAccountItemDTO> {
}

export interface IDAccountItemDTO extends IDAccountDTO {
  Agreement: IDAccountAgreementDTO;
}

export interface IDAccountAgreementDTO {
  // id = agreementId
  id: TModelId;
  Name: string;
  Agreement: string;
  Type: EDAccountAgreementType;
  // Id ген соглашения
  AgreementId?: TModelId;
  Tariff?: string;
}
