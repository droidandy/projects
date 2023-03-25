import { IocContainer, IocModule } from '@invest.wl/core/src/di/IoC';
import {
  ISStorageLocalService, SStorageLocalServiceTid,
} from '@invest.wl/system/src/StorageLocal/S.StorageLocal.types';
import { SStorageLocalModule } from '@invest.wl/system/src/StorageLocal/S.StorageLocal.module';
import { SStorageLocalWebService } from './S.StorageLocalWeb.service';

export class SStorageLocalWebModule extends IocModule {
  private _module = new SStorageLocalModule();

  public configure(ioc: IocContainer): void {
    ioc.bind<ISStorageLocalService>(SStorageLocalServiceTid).to(SStorageLocalWebService).inSingletonScope();
    this._module.configure(ioc);
  }

  public init() {
    return this._module.init();
  }
}
