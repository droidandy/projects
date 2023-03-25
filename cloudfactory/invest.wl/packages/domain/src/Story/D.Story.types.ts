import { IApiResponse, IDStoryInfoRequestDTO, IDStoryInfoResponseDTO, IDStoryListRequestDTO, IDStoryListResponseDTO } from '@invest.wl/core';

export const DStoryAdapterTid = Symbol.for('DStoryAdapterTid');

export interface IDStoryAdapter {
  info(req: IDStoryInfoRequestDTO): Promise<IApiResponse<IDStoryInfoResponseDTO>>;
  list(req: IDStoryListRequestDTO): Promise<IApiResponse<IDStoryListResponseDTO>>;
}

export const DStoryStoreTid = Symbol.for('DStoryStore');
