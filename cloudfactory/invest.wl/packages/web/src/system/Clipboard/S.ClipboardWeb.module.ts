import { IocContainer, IocModule } from '@invest.wl/core/src/di/IoC';
import { ISClipboardService, SClipboardServiceTid } from '@invest.wl/system/src/Clipboard/S.Clipboard.types';
import { SClipboardModule } from '@invest.wl/system/src/Clipboard/S.Clipboard.module';
import { SClipboardWebService } from './S.ClipboardWeb.service';

export class SClipboardWebModule extends IocModule {
  private _module = new SClipboardModule();

  public configure(ioc: IocContainer): void {
    ioc.bind<ISClipboardService>(SClipboardServiceTid).to(SClipboardWebService).inSingletonScope();
    this._module.configure(ioc);
  }

  public init() {
    return this._module.init();
  }
}
