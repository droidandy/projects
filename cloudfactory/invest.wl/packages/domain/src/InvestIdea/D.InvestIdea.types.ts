import {
  IApiResponse,
  IDInvestIdeaInfoRequestDTO,
  IDInvestIdeaInfoResponseDTO,
  IDInvestIdeaListRequestDTO,
  IDInvestIdeaListResponseDTO,
} from '@invest.wl/core';

export const DInvestIdeaAdapterTid = Symbol.for('DInvestIdeaAdapterTid');

export interface IDInvestIdeaAdapter {
  info(req: IDInvestIdeaInfoRequestDTO): Promise<IApiResponse<IDInvestIdeaInfoResponseDTO>>;
  list(req: IDInvestIdeaListRequestDTO): Promise<IApiResponse<IDInvestIdeaListResponseDTO>>;
}
