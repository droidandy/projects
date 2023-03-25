import { SDeviceWebStore } from './S.DeviceWeb.store';
import { IoC, IocContainer, IocModule } from '@invest.wl/core/src/di/IoC';
import {
  ISDeviceConfig, ISDeviceStore, SDeviceConfigTid, SDeviceStoreTid,
} from '@invest.wl/system/src/Device/S.Device.types';
import { SDeviceWebConfig } from './S.DeviceWeb.config';

export class SDeviceWebModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<ISDeviceConfig>(SDeviceConfigTid).to(SDeviceWebConfig).inSingletonScope();
    ioc.bind<ISDeviceStore>(SDeviceStoreTid).to(SDeviceWebStore).inSingletonScope();
  }

  public init() {
    const _store = IoC.get<ISDeviceStore>(SDeviceStoreTid);
    return _store.getDeviceInfo(
      'installationId', 'applicationVersion', 'osVersion', 'coordinates',
      'deviceModel', 'manufacturer', 'MAC',
    );
  }
}
