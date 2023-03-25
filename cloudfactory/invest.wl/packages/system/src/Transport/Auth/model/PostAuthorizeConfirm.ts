export interface IPostAuthorizeConfirmRequest {
  authorizationRequestId: string;
  code: string;
}

export interface IPostAuthorizeConfirmResponse {
  accessToken: string;
  refreshToken: string;
}
