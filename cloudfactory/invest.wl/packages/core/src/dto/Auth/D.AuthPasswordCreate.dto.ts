import { IDAuthPasswordCreate } from './D.Auth.dto';

export interface IDAuthPasswordCreateRequestDTO extends Omit<IDAuthPasswordCreate, 'passwordConfirm'> {
}

export interface IDAuthPasswordCreateResponseDTO {
}
