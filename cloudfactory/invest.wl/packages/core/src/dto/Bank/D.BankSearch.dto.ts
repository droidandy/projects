import { IDBankItemDTO } from './D.Bank.dto';

export interface IDBankSearchRequestDTO {
  text: string;
}

export interface IDBankSearchResponseDTO extends Array<IDBankItemDTO> {
}
