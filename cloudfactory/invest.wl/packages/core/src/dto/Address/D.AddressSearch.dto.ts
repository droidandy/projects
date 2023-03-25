import { IDAddressItemDTO } from './D.Address.dto';

export interface IDAddressSearchRequestDTO {
  text: string;
}

export interface IDAddressSearchResponseDTO extends Array<IDAddressItemDTO> {
}
