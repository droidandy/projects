import { EventX, IErrorModel } from '@invest.wl/common';
import { IErrorExceptionDTO, IErrorMessageMap, ISErrorDTO, ISErrorHttpDTO, ISErrorSecurityDTO, ISErrorSystemDTO } from '@invest.wl/core';
import { DErrorServiceAdapterTid, DErrorStoreAdapterTid, IDErrorServiceAdapter, IDErrorStoreAdapter } from '@invest.wl/domain';

export enum ESErrorHttpCode {
  ClientFailedVerification = 400,
  UserNotLogged = 401,
  AccessDenied = 403,
  WrongData = 409,
  SessionTimeout = 410,
  Server = 500,
}

export enum ESErrorSystemCode {
  NoRefreshToken,
  ClassNotInitialized,
}

export interface ISErrorConfig {
  readonly httpCode2Message: IErrorMessageMap<ISErrorHttpDTO>;
  readonly httpMessage2Message: IErrorMessageMap<string>;
  readonly systemCode2Message: IErrorMessageMap<string>;
}

export interface ISErrorStore extends IDErrorStoreAdapter {
  readonly exceptionX: EventX<IErrorExceptionDTO>;
  addException(exception: IErrorExceptionDTO): void;
}

export interface ISErrorService extends IDErrorServiceAdapter {
  httpHandle(dto: ISErrorHttpDTO | ISErrorHttpModel): ISErrorHttpModel;
  systemHandle(dto: ISErrorSystemDTO | string): ISErrorSystemModel;
  securityHandle(dto: ISErrorSecurityDTO): ISErrorSecurityModel;
}

export const SErrorConfigTid = Symbol.for('SErrorConfigTid');
export const SErrorListenerTid = Symbol.for('SErrorListenerTid');
export const SErrorServiceTid = DErrorServiceAdapterTid;
export const SErrorStoreTid = DErrorStoreAdapterTid;

export interface ISErrorAuthable {
  readonly signoutNeed: boolean;
  readonly refreshNeed: boolean;
}

export interface ISErrorModel<T extends ISErrorDTO> extends IErrorModel<T> {
}

export interface ISErrorHttpModel<DTO extends ISErrorHttpDTO = ISErrorHttpDTO> extends ISErrorModel<DTO>, ISErrorAuthable {
  readonly isNetwork: boolean;
  readonly isBusiness: boolean;
  readonly isTechnical: boolean;
  readonly isUnauthorized: boolean;
  readonly isAccess: boolean;
}

export interface ISErrorSystemModel<DTO extends ISErrorSystemDTO = ISErrorSystemDTO> extends ISErrorModel<DTO>, ISErrorAuthable {
}

export interface ISErrorSecurityModel<DTO extends ISErrorSecurityDTO = ISErrorSecurityDTO> extends ISErrorModel<DTO>, ISErrorAuthable {
  readonly code: number | string;
  readonly renewNeed: boolean;
  readonly continueCan: boolean;
  readonly isCancelled: boolean;
}
