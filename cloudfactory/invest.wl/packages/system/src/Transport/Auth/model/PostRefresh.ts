export interface IPostRefreshRequest {
  refresh_token: string;
  client_id?: string;
  grant_type?: 'refresh_token';
}

export interface IPostRefreshResponse {
  refresh_token: string;
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
}
