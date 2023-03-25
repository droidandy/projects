import { IocContainer, IocModule } from '@invest.wl/core';
import { ISFileService, SFileModule, SFileServiceTid } from '@invest.wl/system';
import { SFileMobileService } from './S.FileMobile.service';

export class SFileMobileModule extends IocModule {
  private _module = new SFileModule();

  public configure(ioc: IocContainer): void {
    ioc.bind<ISFileService>(SFileServiceTid).to(SFileMobileService).inSingletonScope();
    this._module.configure(ioc);
  }

  public init() {
    return this._module.init();
  }
}
