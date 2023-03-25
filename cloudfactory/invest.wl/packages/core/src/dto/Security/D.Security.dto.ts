export interface IDSecurityCode {
  code: string;
}

export enum EDSecurityType {
  CODE,
  BIO
}

export interface IDSecurityPayload {
  by: EDSecurityType;
  text: string;
}

export enum EDSecurityBiometryType {
  Finger = 'TouchID',
  Face = 'FaceID',
}
