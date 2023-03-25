import { TModelId } from '../../types';
import { EDDocumentStatus, EDDocumentType, IDDocumentDTO } from './D.Document.dto';

export interface IDDocumentListRequestDTO {
  contextId?: TModelId;
  statusList?: EDDocumentStatus[];
  typeList?: EDDocumentType[];
  limit?: number;
  offset?: number;
}

export interface IDDocumentListResponseDTO {
  list: IDDocumentDTO[];
}
