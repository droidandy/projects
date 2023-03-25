import { EDAuthPasswordStatus, EDAuthPasswordType, IDAuthCred } from './D.Auth.dto';

export interface IDAuthSigninPrepareRequestDTO extends IDAuthCred {
}

export interface IDAuthSigninPrepareResponseDTO {
  passwordType: EDAuthPasswordType;
  passwordStatus: EDAuthPasswordStatus;
}
