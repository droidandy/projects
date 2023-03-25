import { IDaDataAddressDTO } from './IDaDataAddressDTO';

export interface IDaDataAddressRequest {
  query: string;
}

export interface IDaDataAddressResponse {
  suggestions: IDaDataAddressDTO[];
}
