import { EDAuthExternalType, IDAuthSession } from './D.Auth.dto';

export interface IDAuthExternalConfirmRequestDTO {
  type: EDAuthExternalType;
  code: string;
}

export interface IDAuthExternalConfirmResponseDTO extends IDAuthSession {
}
