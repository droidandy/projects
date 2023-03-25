import { IocContainer, IocModule } from '@invest.wl/core';
import { DFileService, DFileServiceTid } from './D.File.service';

export class DFileModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<DFileService>(DFileServiceTid).to(DFileService).inSingletonScope();
  }
}
