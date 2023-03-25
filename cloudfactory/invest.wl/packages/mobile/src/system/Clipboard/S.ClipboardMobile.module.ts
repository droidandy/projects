import { IocContainer, IocModule } from '@invest.wl/core';
import { ISClipboardService, SClipboardModule, SClipboardServiceTid } from '@invest.wl/system';
import { SClipboardMobileService } from './S.ClipboardMobile.service';

export class SClipboardMobileModule extends IocModule {
  private _module = new SClipboardModule();

  public configure(ioc: IocContainer): void {
    ioc.bind<ISClipboardService>(SClipboardServiceTid).to(SClipboardMobileService).inSingletonScope();
    this._module.configure(ioc);
  }

  public init() {
    return this._module.init();
  }
}
