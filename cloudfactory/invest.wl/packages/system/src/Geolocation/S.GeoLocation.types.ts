import { IDGeolocationResponseDTO, IErrorDTO } from '@invest.wl/core';

export interface ISGeoLocationService {
  readonly isInitialized: boolean;
  readonly isAllow: boolean;
  readonly lastGeoLocation: IDGeolocationResponseDTO | null;
  readonly lastError: IErrorDTO | null;

  init(): Promise<void>;
  get(): Promise<IDGeolocationResponseDTO>;
  refresh(): Promise<boolean>;
  permissionRead(): Promise<void>;
}

export const SGeoLocationServiceTid = Symbol.for('SGeoLocationServiceTid');
