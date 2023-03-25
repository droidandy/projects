import { TModelId } from '../../types';
import { IDBankAccountEditDTO } from '../Bank';
import { EDAccountMarketType, EDAccountAgreementType } from './D.Account.dto';

export interface IDAccountAgreementCreateRequestDTO {
  bankAccount: IDBankAccountEditDTO;
  type: EDAccountAgreementType;
  tariffId: TModelId;
  marketTypeList: EDAccountMarketType[];
  quikTypeList: TModelId[];
  // брокерское обслуживание на условиях единого лимита
  singleLimit?: boolean;
  // возможность совершения необеспеченных сделок
  loan?: boolean;
  // есть ли ИИС в другом банке
  IISOtherOwner?: boolean;
}

export interface IDAccountAgreementCreateResponseDTO {
}
