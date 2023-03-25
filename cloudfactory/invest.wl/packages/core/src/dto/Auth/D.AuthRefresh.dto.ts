import { IDAuthSession } from './D.Auth.dto';

export interface IDAuthRefreshRequestDTO extends Pick<Required<IDAuthSession>, 'refreshToken'> {
}

export interface IDAuthRefreshResponseDTO extends IDAuthSession {
}
