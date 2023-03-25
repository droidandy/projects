import { IDAuthCred, IDAuthSession } from './D.Auth.dto';

export interface IDAuthSigninRequestDTO extends IDAuthCred {
}

export interface IDAuthSigninResponseDTO extends IDAuthSession {
}
