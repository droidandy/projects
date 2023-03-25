export interface TokenDTO {
  token_type: string;
  expires_in: string | number;
  access_token: string;
  refresh_token: string;
  confirmation_token: string;
  token: string;
}
