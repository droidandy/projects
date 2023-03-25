import {
  IApiResponse,
  IDOperationDepositCreateDTO,
  IDOperationDepositResponseDTO,
  IDOperationListRequestDTO,
  IDOperationListResponseDTO,
} from '@invest.wl/core';

export const DOperationAdapterTid = Symbol.for('DOperationAdapterTid');

export interface IDOperationAdapter {
  List(req: IDOperationListRequestDTO): Promise<IApiResponse<IDOperationListResponseDTO>>;
  DepositCreate(req: IDOperationDepositCreateDTO): Promise<IDOperationDepositResponseDTO>;
}
