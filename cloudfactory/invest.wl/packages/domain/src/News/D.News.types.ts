import { IApiResponse, IDNewsInfoRequestDTO, IDNewsInfoResponseDTO, IDNewsListRequestDTO, IDNewsListResponseDTO } from '@invest.wl/core';

export const DNewsAdapterTid = Symbol.for('DNewsAdapterTid');

export interface IDNewsAdapter {
  info(req: IDNewsInfoRequestDTO): Promise<IApiResponse<IDNewsInfoResponseDTO>>;
  list(req: IDNewsListRequestDTO): Promise<IApiResponse<IDNewsListResponseDTO>>;
}
