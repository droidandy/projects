import { TModelId } from '../../types';
import { IDImageDefault } from '../Image/D.Image.dto';
import { EDInstrumentAssetSubType, EDInstrumentAssetType } from '../Instrument';
import { EDOperationStatus, EDOperationType } from './D.Operation.dto';

export interface IDOperationListRequestDTO {
  accountIdList?: TModelId[];
  offset?: number;
  pageSize?: number;
}

export interface IDOperationListResponseDTO extends Array<IDOperationItemDTO> {
}

export interface IDOperationItemDTO {
  // id = operationId
  id: TModelId;
  Date: Date;
  Type: EDOperationType;
  Status: EDOperationStatus;
  Amount: number;
  Price: number;
  Comment: string;
  TS: number;
  Instrument: IDOperationInstrumentDTO;
  // Связанный инструмент
  LinkInstrument: IDOperationInstrumentDTO;
  Agreement: IDOperationAgreementDTO;
  Account: IDOperationAccountDTO;
}

export interface IDOperationInstrumentLinkDTO {
  id: TModelId;
  Name: string;
  // TODO: ask no classCode?
  // ClassCode: string;
  SecureCode?: string;
  Image: IDImageDefault;
}

export interface IDOperationInstrumentDTO extends IDOperationInstrumentLinkDTO {
  AssetType: EDInstrumentAssetType;
  AssetSubType: EDInstrumentAssetSubType;
}

export interface IDOperationAgreementDTO {
  // id = agreementId
  id: TModelId;
  Name: string;
}

export interface IDOperationAccountDTO {
  // id = accountId
  id: TModelId;
  Name: string;
}
