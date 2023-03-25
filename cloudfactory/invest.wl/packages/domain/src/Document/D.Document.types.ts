import {
  IApiResponse,
  IDDocumentCreateManyRequestDTO,
  IDDocumentCreateManyResponseDTO,
  IDDocumentCreateRequestDTO,
  IDDocumentCreateResponseDTO,
  IDDocumentListManyRequestDTO,
  IDDocumentListManyResponseDTO,
  IDDocumentListRequestDTO,
  IDDocumentListResponseDTO,
  IDDocumentSignConfirmRequestDTO,
  IDDocumentSignConfirmResponseDTO,
  IDDocumentSignPrepareRequestDTO,
  IDDocumentSignPrepareResponseDTO,
  IDDocumentSmsSendRequestDTO,
  IDDocumentSmsSendResponseDTO,
  IDDocumentTemplateMap,
} from '@invest.wl/core';

export const DDocumentAdapterTid = Symbol.for('DDocumentAdapterTid');
export const DDocumentGatewayTid = Symbol.for('DDocumentGatewayTid');
export const DDocumentStoreTid = Symbol.for('DDocumentStoreTid');
export const DDocumentConfigTid = Symbol.for('DDocumentConfigTid');

export interface IDDocumentAdapter {
  listSelf(req: IDDocumentListRequestDTO): Promise<IApiResponse<IDDocumentListResponseDTO>>;
  listSelfMany(req: IDDocumentListManyRequestDTO): Promise<IApiResponse<IDDocumentListManyResponseDTO>>;
  create(req: IDDocumentCreateRequestDTO): Promise<IApiResponse<IDDocumentCreateResponseDTO>>;
  createMany(req: IDDocumentCreateManyRequestDTO): Promise<IApiResponse<IDDocumentCreateManyResponseDTO>>;
  signPrepare(req: IDDocumentSignPrepareRequestDTO): Promise<IApiResponse<IDDocumentSignPrepareResponseDTO>>;
  signConfirm(req: IDDocumentSignConfirmRequestDTO): Promise<IApiResponse<IDDocumentSignConfirmResponseDTO>>;
  smsSend(req: IDDocumentSmsSendRequestDTO): Promise<IApiResponse<IDDocumentSmsSendResponseDTO>>;
  readonly createReloadInterval: number;
  readonly codeLength: number;
  readonly templateMap: IDDocumentTemplateMap;
  readonly smsResentTimeout: number;
}

export interface IDDocumentConfig {
  readonly codeLength: number;
  readonly smsResentTimeout: number;
  readonly templateMap: IDDocumentTemplateMap;
  readonly createReloadInterval: number;
}

