import { IoC, IocContainer, IocModule } from '@invest.wl/core';
import { ISDeviceStore, SDeviceStoreTid } from '@invest.wl/system';
import { SDeviceMobileStore } from './S.DeviceMobile.store';
import { ISDeviceInfoMobile } from './S.DeviceMobile.types';

export class SDeviceMobileModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<ISDeviceStore<ISDeviceInfoMobile>>(SDeviceStoreTid).to(SDeviceMobileStore).inSingletonScope();
  }

  public init() {
    const _store = IoC.get<ISDeviceStore<ISDeviceInfoMobile>>(SDeviceStoreTid);
    return _store.getDeviceInfo(
      'productId', 'installationId', 'applicationVersion', 'osVersion', 'coordinates',
      'deviceModel', 'manufacturer', 'IMEI', 'IMSI', 'MAC', 'simOperator',
    );
  }
}
