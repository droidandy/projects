export interface IPostLoginRequest {
  username: string;
  password: string;
  client_id?: string;
  grant_type?: 'password';
}

export interface IPostLoginResponse {
  access_token: string;
  refresh_token?: string;
}
