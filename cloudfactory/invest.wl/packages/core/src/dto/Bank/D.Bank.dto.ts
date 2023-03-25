import { IDAddressDTO } from '../Address';

export interface IDBankDTO {
  name: string;
  bik: string;
  inn?: string;
  kpp?: string;
  swift?: string;
  // корреспондентский счёт
  accountCorr?: string;
  address?: IDAddressDTO;
}

export interface IDBankItemDTO extends IDBankDTO {
  id: string;
}
