import { IoC, IocModule } from '@invest.wl/core';
import { ISHardwareBackStore, SHardwareBackStoreTid } from './S.HardwareBack.types';

export class SHardwareBackModule extends IocModule {
  public init() {
    const _store = IoC.get<ISHardwareBackStore>(SHardwareBackStoreTid);
    return _store.init();
  }
}
