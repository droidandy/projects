import { IocContainer, IocModule } from '@invest.wl/core';
import { ISStorageLocalService, SStorageLocalModule, SStorageLocalServiceTid } from '@invest.wl/system';
import { SStorageLocalMobileService } from './S.StorageLocalMobile.service';

export class SStorageLocalMobileModule extends IocModule {
  private _module = new SStorageLocalModule();

  public configure(ioc: IocContainer): void {
    ioc.bind<ISStorageLocalService>(SStorageLocalServiceTid).to(SStorageLocalMobileService).inSingletonScope();
    this._module.configure(ioc);
  }

  public init() {
    return this._module.init();
  }
}
