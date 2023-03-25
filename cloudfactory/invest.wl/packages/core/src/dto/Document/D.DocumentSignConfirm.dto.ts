import { TModelId } from '../../types';
import { IDDocumentContextType } from './D.Document.dto';

export interface IDDocumentSignConfirmRequestDTO {
  code: string;
}

export interface IDDocumentSignConfirmResponseDTO {
  contextId?: TModelId;
  contextType?: IDDocumentContextType;
}
