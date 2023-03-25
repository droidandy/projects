import { EDStorageLocalKey, Inject, Injectable } from '@invest.wl/core';
import { ISConfigStore, ISDeviceStore, ISStorageLocalService, SConfigStoreTid, SStorageLocalServiceTid } from '@invest.wl/system';

import memoize from 'lodash/memoize';
import { Platform } from 'react-native';
import DeviceInfoModule from 'react-native-device-info';
import IMEI from 'react-native-imei';
import { ISDeviceInfoMobile } from './S.DeviceMobile.types';

type ISDeviceResolvers = {
  [key in keyof ISDeviceInfoMobile]: () => Promise<any>
};

@Injectable()
export class SDeviceMobileStore implements ISDeviceStore<ISDeviceInfoMobile> {
  public static IMEI_ANDROID_VERSION_MAX = 28;
  private _cache: ISDeviceInfoMobile = {};
  private _resolvers: ISDeviceResolvers = {
    productId: async () => this._cfg.static.productId,
    installationId: () => this._sl.get(EDStorageLocalKey.ApplicationInstanceId),
    applicationVersion: async () => this._cfg.appVersionBuild,
    osVersion: async () => `${Platform.OS} ${Platform.Version}`,
    deviceModel: async () => DeviceInfoModule.getModel(),
    manufacturer: () => DeviceInfoModule.getManufacturer(),
    IMEI: async () => this._isAvailableImei ? IMEI.getImei() : 'NA',
    IMSI: async () => this._isAvailableImei ? IMEI.getImsi() : 'NA',
    coordinates: async () => {
      // const location = await this._geoLocationService.getFreshGeoLocation();
      // const rv = `${location.coords.latitude},${location.coords.longitude}`;
      return '0,0';
    },
    MAC: () => DeviceInfoModule.getMacAddress(),
    simOperator: async () => DeviceInfoModule.getCarrier(),
    IPAddress: () => DeviceInfoModule.getIpAddress(),
  };

  private _deviceInfoAsString = memoize((deviceInfo: ISDeviceInfoMobile) => {
    const values = [
      deviceInfo.productId,
      deviceInfo.installationId,
      deviceInfo.applicationVersion,
      deviceInfo.osVersion,
      deviceInfo.deviceModel,
      deviceInfo.manufacturer,
      deviceInfo.IMEI,
      deviceInfo.IMSI,
      deviceInfo.coordinates,
      deviceInfo.simOperator,
      deviceInfo.MAC,
    ];

    return values.join(';');
  });

  constructor(
    @Inject(SStorageLocalServiceTid) private _sl: ISStorageLocalService,
    @Inject(SConfigStoreTid) private _cfg: ISConfigStore,
    // @Inject(IGeoLocationServiceTid) private _geoLocationService: IGeoLocationService,
  ) { }

  public async getDeviceInfo<TKey extends keyof ISDeviceInfoMobile>(...keysForRefresh: TKey[]) {
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

  // Начиная с android 10 (api 29) для получения imei нужно спец разрещение, его могут получить только системные апки, рлэтому игнорируем с 10v
  // https://developer.android.com/about/versions/10/privacy/changes#non-resettable-device-ids
  private get _isAvailableImei() {
    return Platform.OS === 'android' && Platform.Version <= SDeviceMobileStore.IMEI_ANDROID_VERSION_MAX;
  }
}
