import { IDDocumentDTO } from './D.Document.dto';
import { IDDocumentListRequestDTO } from './D.DocumentList.dto';

export interface IDDocumentListManyRequestDTO {
  list: IDDocumentListRequestDTO[];
}

export interface IDDocumentListManyResponseDTO {
  list: IDDocumentDTO[];
}
