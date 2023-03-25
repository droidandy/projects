import { IApiResponse, IDTradeListRequestDTO, IDTradeListResponseDTO } from '@invest.wl/core';

export const DTradeAdapterTid = Symbol.for('DTradeAdapterTid');

export interface IDTradeAdapter {
  list(req: IDTradeListRequestDTO): Promise<IApiResponse<IDTradeListResponseDTO>>;
}
