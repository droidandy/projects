import { TModelId } from '../../types';

export interface IDInstrumentFavoriteUserUpdateRequestDTO {
  // id = instrumentId
  id: TModelId;
  isFavorite: boolean;
  classCode?: string;
  secureCode?: string;
}

export interface IDInstrumentFavoriteUserUpdateResponseDTO {
}
