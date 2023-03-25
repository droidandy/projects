import memoize from 'lodash/memoize';
import { Inject, Injectable } from '@invest.wl/core/src/di/IoC';
import { ISConfigStore, SConfigStoreTid } from '@invest.wl/system/src/Config/S.Config.types';
import {
  ISStorageLocalService, SStorageLocalServiceTid,
} from '@invest.wl/system/src/StorageLocal/S.StorageLocal.types';
import { ISDeviceInfo, ISDeviceStore } from '@invest.wl/system/src/Device/S.Device.types';
import { EDStorageLocalKey } from '@invest.wl/core/src/dto/StorageLocal';

type ISDeviceResolvers = {
  [key in keyof ISDeviceInfo]: () => Promise<any>
};

@Injectable()
export class SDeviceWebStore implements ISDeviceStore {
  private _cache: ISDeviceInfo = {};
  private _resolvers: ISDeviceResolvers = {
    installationId: () => this._sl.get(EDStorageLocalKey.ApplicationInstanceId),
    applicationVersion: async () => this._cfg.appVersionBuild,
    osVersion: async () => navigator.platform,
    deviceModel: async () => `${navigator.appName} ${navigator.appCodeName}`,
    manufacturer: async () => navigator.vendor,
    coordinates: async () => {
      // const location = await this._geoLocationService.getFreshGeoLocation();
      // const rv = `${location.coords.latitude},${location.coords.longitude}`;
      return '0,0';
    },
    MAC: async () => '',
    IPAddress: async () => '',
  };

  private _deviceInfoAsString = memoize((deviceInfo: ISDeviceInfo) => {
    const values = [
      deviceInfo.installationId,
      deviceInfo.applicationVersion,
      deviceInfo.osVersion,
      deviceInfo.deviceModel,
      deviceInfo.manufacturer,
      deviceInfo.coordinates,
      deviceInfo.MAC,
    ];

    return values.join(';');
  });

  constructor(
    @Inject(SStorageLocalServiceTid) private _sl: ISStorageLocalService,
    @Inject(SConfigStoreTid) private _cfg: ISConfigStore,
    // @Inject(IGeoLocationServiceTid) private _geoLocationService: IGeoLocationService,
  ) { }

  public async getDeviceInfo<TKey extends keyof ISDeviceInfo>(...keysForRefresh: TKey[]) {
    if (!keysForRefresh.length) return this._cache;

    let changed = false;
    await Promise.all(keysForRefresh.map(key =>
      this._resolvers[key]?.()
        .then(v => {
          if (!changed) changed = this._cache[key] !== v;
          this._cache[key] = v;
        })
        .catch((err: any) => {
          this._cache[key] = 'NA';
        })));

    if (changed) this._cache = { ...this._cache };
    return this._cache;
  }

  public getDeviceInfoAsString = async () => {
    const di = await this.getDeviceInfo();
    return this._deviceInfoAsString(di);
  };
}
