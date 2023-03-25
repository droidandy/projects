import { TModelId } from '../../types';
import { IDDocumentContextType } from './D.Document.dto';
import { TDDocumentTemplate } from './D.Document.types';

export interface IDDocumentCreateRequestDTO {
  // список шаблонов документов
  templateList: TDDocumentTemplate[];
  // ID контекстной сущности (документа \ заявки \ сделки и тд)
  contextId?: TModelId;
  // контекстная сущность (документ \ заявка \ сделка и тд)
  contextType?: IDDocumentContextType;
}

export interface IDDocumentCreateResponseDTO {
}
