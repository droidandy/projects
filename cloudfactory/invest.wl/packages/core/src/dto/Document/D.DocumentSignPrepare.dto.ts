import { TDurationISO8601, TModelId } from '../../types';

export interface IDDocumentSignPrepareRequestDTO {
  idList: TModelId[];
}

export interface IDDocumentSignPrepareResponseDTO {
  ttl?: TDurationISO8601;
}
