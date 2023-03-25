import {
  IApiResponse,
  IDOrderCancelRequestDTO,
  IDOrderCancelResponseDTO,
  IDOrderIdCreateRequestDTO,
  IDOrderIdCreateResponseDTO,
  IDOrderInfoRequestDTO,
  IDOrderInfoResponseDTO,
  IDOrderListRequestDTO,
  IDOrderListResponseDTO,
  IDOrderRequestConfirmRequestDTO,
  IDOrderRequestConfirmResponseDTO,
  IDOrderRequestCreateRequestDTO,
  IDOrderRequestCreateResponseDTO,
} from '@invest.wl/core';
import { IDOrderCreateModel } from './model/D.OrderCreate.model';
import { IDOrderCreateConfirmModel } from './model/D.OrderCreateConfirm.model';

export const DOrderAdapterTid = Symbol.for('DOrderAdapterTid');
export const DOrderCreateConfirmStrategyTid = Symbol.for('DOrderCreateConfirmStrategyTid');

export enum EDOrderConfirmStrategy {
  Simple,
  SMS,
  Security
}

export interface IDOrderCreateConfirmStrategy {
  onCreate(model: IDOrderCreateModel): Promise<void>;
  onConfirm(model: IDOrderCreateConfirmModel): Promise<void>;
}

export interface IDOrderAdapter {
  info(req: IDOrderInfoRequestDTO): Promise<IApiResponse<IDOrderInfoResponseDTO>>;
  list(req: IDOrderListRequestDTO): Promise<IApiResponse<IDOrderListResponseDTO>>;
  cancel(req: IDOrderCancelRequestDTO): Promise<IApiResponse<IDOrderCancelResponseDTO>>;
  idCreate(req: IDOrderIdCreateRequestDTO): Promise<IApiResponse<IDOrderIdCreateResponseDTO>>;
  requestCreate(req: IDOrderRequestCreateRequestDTO): Promise<IApiResponse<IDOrderRequestCreateResponseDTO>>;
  requestConfirm(req: IDOrderRequestConfirmRequestDTO): Promise<IApiResponse<IDOrderRequestConfirmResponseDTO>>;
  // config
  readonly cancelInterval: number;
  readonly cancelCheckTimeout: number;
  readonly createCodeLength: number;
  readonly createCodeResendInterval: number;
  readonly createCheckInterval: number;
  readonly createCheckTimeout: number;
}

