export enum EDAuthForgotFactor {
  Login,
  Phone,
}

export enum EDAuthPasswordType {
  Temporary = 0,
  Permanent = 1,
}

export enum EDAuthPasswordStatus {
  Expired = 0,
  Valid = 1,
}

export enum EDAuthPasswordHash {
  UNKNOWN = 0,
  MD5 = 1,
  SHA512 = 2,
  HMACSHA512 = 3,
}

export interface IDAuthSession {
  accessToken: string;
  expiresIn?: Date;
  refreshToken?: string;
  refreshExpiresIn?: Date;
}

export interface IDAuthCred {
  login: string;
  password: string;
}

export interface IDAuthUser {
  fio: string;
  phone: string;
  email: string;
}

export interface IDAuthPasswordRestore {
  fioEmail: string;
  serial: string;
  num: string;
}

export interface IDAuthPasswordCreate {
  password: string;
  passwordConfirm: string;
}

export interface IDAuthPasswordChange {
  passwordOld: string;
  password: string;
  passwordConfirm: string;
}

export enum EDAuthStrategy {
  Cred,
  RefreshToken,
}

export enum EDAuthExternalType {
  ESIA,
  Keycloak
}
