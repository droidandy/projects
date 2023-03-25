export enum EDApplicationState {
  unknown,
  active,
  inactive,
  background,
}

export interface ISApplicationVersionDTO {
  info: string;
  build: string;
  buildRevision: string;
  adviser: string;
}
