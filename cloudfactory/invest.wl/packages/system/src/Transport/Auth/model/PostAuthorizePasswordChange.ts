export interface IPostAuthorizePasswordChangeRequest {
  authorizationRequestId: string;
  oldPassword: string;
  newPassword: string;
  eKey: string;
}

export interface IPostAuthorizePasswordChangeResponse {
}
