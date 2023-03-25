import { EDAuthPasswordHash } from '@invest.wl/core';

export interface IPostAuthorizeLoginPrepareRequest {
  login: string;
}

export interface IPostAuthorizeLoginPrepareResponse {
  passwordHashType: EDAuthPasswordHash;
  eKey: string;
  passwordSalt: string;
}
