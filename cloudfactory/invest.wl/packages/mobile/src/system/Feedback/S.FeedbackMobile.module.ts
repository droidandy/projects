import { IocContainer, IocModule } from '@invest.wl/core';
import { ISFeedbackService, SFeedbackModule, SFeedbackServiceTid } from '@invest.wl/system';
import { SFeedbackMobileService } from './S.FeedbackMobile.service';

export class SFeedbackMobileModule extends IocModule {
  private _module = new SFeedbackModule();

  public configure(ioc: IocContainer): void {
    ioc.bind<ISFeedbackService>(SFeedbackServiceTid).to(SFeedbackMobileService).inSingletonScope();
    this._module.configure(ioc);
  }

  public init() {
    return this._module.init();
  }
}
