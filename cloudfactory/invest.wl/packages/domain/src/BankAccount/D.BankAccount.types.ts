import { IApiResponse, IDBankSearchRequestDTO, IDBankSearchResponseDTO } from '@invest.wl/core';

export const DBankAccountAdapterTid = Symbol.for('DBankAccountAdapterTid');

export interface IDBankAccountAdapter {
  // list(req: IDBankAccountListRequestDTO): Promise<IApiResponse<IDBankAccountListResponseDTO>>;
  search(req: IDBankSearchRequestDTO): Promise<IApiResponse<IDBankSearchResponseDTO>>;
  // save(req: IDBankAccountListRequestDTO): Promise<IApiResponse<IDBankAccountListResponseDTO>>;
  // delete(req: IDBankAccountListRequestDTO): Promise<IApiResponse<IDBankAccountListResponseDTO>>;
}
