import { EDAuthExternalType } from './D.Auth.dto';

export interface IDAuthExternalUrlRequestDTO {
  type: EDAuthExternalType;
}

export interface IDAuthExternalUrlResponseDTO {
  url: string;
}
