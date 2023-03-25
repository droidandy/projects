export interface GetLoginKeycloakRequest {
  code: string;
  client_id?: string;
  grant_type?: 'authorization_code';
}

export interface GetLoginKeycloakResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  'not-before-policy': number;
  session_state: string;
  // email username profile ?
  scope: any;
}
