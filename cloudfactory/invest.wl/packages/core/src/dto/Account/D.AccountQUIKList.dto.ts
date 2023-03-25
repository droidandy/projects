import { TModelId } from '../../types';
import { EDAccountAgreementType, IDAccountDTO } from './D.Account.dto';

export interface IDAccountQUIKListRequestDTO {
  instrumentId?: TModelId;
  classCode?: string;
  secureCode?: string;
  currencyName?: string;
}

export interface IDAccountQUIKListResponseDTO extends Array<IDAccountQUIKItemDTO> {
}

export interface IDAccountQUIKItemDTO extends IDAccountDTO {
  Agreement: IDAccountQUIKAgreementDTO;
  MinAmount?: number;
  FreeMoneyTx?: number;
}

export interface IDAccountQUIKAgreementDTO {
  // id = agreementId
  id: TModelId;
  Name: string;
  Agreement: string;
  Type: EDAccountAgreementType;
  OwnAgreement?: number;
  ParentAgreement?: string;
  Kind?: number;
  OpenDate?: Date;
  QIType?: number;
  Tariff?: IDAccountQUIKTariff;
}

export interface IDAccountQUIKTariff {
  TariffId: number;
  Text: string;
  Name: string;
  Details: string;
}
