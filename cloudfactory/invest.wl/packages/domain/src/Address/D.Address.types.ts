import { IApiResponse, IDAddressSearchRequestDTO, IDAddressSearchResponseDTO } from '@invest.wl/core';

export const DAddressAdapterTid = Symbol.for('DAddressAdapterTid');

export interface IDAddressAdapter {
  search(req: IDAddressSearchRequestDTO): Promise<IApiResponse<IDAddressSearchResponseDTO>>;
}
