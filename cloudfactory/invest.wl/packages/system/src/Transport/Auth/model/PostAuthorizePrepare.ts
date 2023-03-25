import { EDAuthPasswordStatus, EDAuthPasswordType } from '@invest.wl/core';

export interface IPostAuthorizePrepareRequest {
  login: string;
  password: string;
  eKey: string;
}

export interface IPostAuthorizePrepareResponse {
  passwordType: EDAuthPasswordType;
  passwordStatus: EDAuthPasswordStatus;
  authorizationRequestId: string;
}
