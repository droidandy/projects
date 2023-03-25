import { TModelId } from '../../types';
import { IDFileDTO } from './D.File.dto';

export interface IDFileUploadRequestDTO {
  file: IDFileDTO;
}

export interface IDFileUploadResponseDTO {
  // по факту это будет upload id, который мы сами и отправляем
  id: TModelId;
}
