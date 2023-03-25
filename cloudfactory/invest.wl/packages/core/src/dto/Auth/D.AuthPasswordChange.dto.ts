import { IDAuthPasswordChange } from './D.Auth.dto';

export interface IDAuthPasswordChangeRequestDTO extends Omit<IDAuthPasswordChange, 'passwordConfirm'> {
}

export interface IDAuthPasswordChangeResponseDTO {
}
