import { IDGeolocationResponseDTO, IErrorDTO, Injectable } from '@invest.wl/core';
import { ISGeoLocationService } from '@invest.wl/system';
import { action, computed, makeObservable, observable } from 'mobx';
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation, { GeoError, GeoOptions, GeoPosition } from 'react-native-geolocation-service';

const getCurrentPositionOpts: GeoOptions = {
  timeout: 60000 * 3,
  maximumAge: 60000, // время кеширования координат
  enableHighAccuracy: false,
};

@Injectable()
export class SGeoLocationMobileService implements ISGeoLocationService {
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
    this._initializeIfNeeded();

    return await this._getCurrentPosition();
  }

  public async refresh(): Promise<boolean> {
    try {
      const lastGeoLocation = await this.get();
      this._setLastGeoLocation(lastGeoLocation);
      this._setGeoLocationError(null);
    } catch (e: any) {
      this._setLastGeoLocation(null);
      this._setGeoLocationError(e);
    }

    return !this._lastError;
  }

  @action.bound
  public async permissionRead() {
    this.isAllow = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
  }

  public _getCurrentPosition(): Promise<GeoPosition> {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(resolve, reject, getCurrentPositionOpts);
    });
  }

  @action.bound
  public _setLastGeoLocation(geolocation: IDGeolocationResponseDTO | null) {
    this._lastGeoLocation = geolocation;
  }

  @action.bound
  public _setGeoLocationError(geolocationError: GeoError | null) {
    this._lastError = geolocationError;
  }

  @action.bound
  private _initializeIfNeeded() {
    if (!this.isInitialized) {
      if (Platform.OS === 'ios') {
        Geolocation.requestAuthorization('whenInUse');
      }
      this.isInitialized = true;
    }
  }
}
