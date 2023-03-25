import { action, computed, makeObservable, observable } from 'mobx';
import { ISGeoLocationService } from '@invest.wl/system/src/Geolocation/S.GeoLocation.types';
import { Injectable } from '@invest.wl/core/src/di/IoC';
import { IDGeolocationResponseDTO } from '@invest.wl/core/src/dto/Geolocation/D.Geolocation.dto';
import { IErrorDTO } from '@invest.wl/core/src/dto/Error/Error.dto';

const getCurrentPositionOpts: PositionOptions = {
  timeout: 60000 * 3,
  maximumAge: 60000, // время кеширования координат
  enableHighAccuracy: false,
};

@Injectable()
export class SGeoLocationWebService implements ISGeoLocationService {
  public isInitialized: boolean = false;
  @observable public isAllow: boolean = true;
  @observable private _lastGeoLocation: IDGeolocationResponseDTO | null = null;

  @computed
  public get lastGeoLocation(): IDGeolocationResponseDTO | null {
    return this._lastGeoLocation;
  }

  @observable private _lastError: IErrorDTO | null = null;

  @computed
  public get lastError(): IErrorDTO | null {
    return this._lastError;
  }

  constructor() {
    makeObservable(this);
  }

  public async init() {
    await this.refresh();
  }

  public async get(): Promise<IDGeolocationResponseDTO> {
    await this._permissionCheck();
    return await this._get();
  }

  public async refresh(): Promise<boolean> {
    try {
      const lastGeoLocation = await this.get();
      this._lastUpdate(lastGeoLocation);
      this._errorSet(null);
    } catch (e: any) {
      this._lastUpdate(null);
      this._errorSet(e);
    }

    return !this._lastError;
  }

  @action.bound
  public async permissionRead() {
    if ('geolocation' in navigator) {
      try {
        this.isAllow = await navigator.permissions.query({ name: 'geolocation' })
          .then(result => {
            result.onchange = () => {
              this._allowSet(result.state === 'granted');
            };
            return result.state === 'granted';
          });
      } catch (e: any) {
        this.isAllow = false;
      }
    } else {
      this.isAllow = false;
    }
  }

  public _get(): Promise<IDGeolocationResponseDTO> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, getCurrentPositionOpts);
    });
  }

  @action.bound
  public _lastUpdate(geolocation: IDGeolocationResponseDTO | null) {
    this._lastGeoLocation = geolocation;
  }

  @action.bound
  public _errorSet(geolocationError: GeolocationPositionError | null) {
    this._lastError = geolocationError;
  }

  @action.bound
  private async _permissionCheck() {
    if (!this.isInitialized) {
      await navigator.permissions.query({ name: 'geolocation' });
      this.isInitialized = true;
    }
  }

  @action
  private _allowSet(allow: boolean) {
    this.isAllow = allow;
  }
}
