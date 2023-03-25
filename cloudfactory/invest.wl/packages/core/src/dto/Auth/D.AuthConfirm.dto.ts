import { IDAuthSession } from './D.Auth.dto';

export interface IDAuthConfirmRequestDTO {
  code: string;
}

export interface IDAuthConfirmResponseDTO extends IDAuthSession {
}
