import { EDAuthExternalType } from './D.Auth.dto';

export interface IDAuthExternalUrlSuccessRequestDTO {
  type: EDAuthExternalType;
}

export interface IDAuthExternalUrlSuccessResponseDTO {
  url: string;
}
