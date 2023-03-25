import { IocContainer, IocModule } from '@invest.wl/core/src/di/IoC';
import { ISFeedbackService, SFeedbackServiceTid } from '@invest.wl/system/src/Feedback/S.Feedback.types';
import { SFeedbackModule } from '@invest.wl/system/src/Feedback/S.Feedback.module';
import { SFeedbackWebService } from './S.FeedbackWeb.service';

export class SFeedbackWebModule extends IocModule {
  private _module = new SFeedbackModule();

  public configure(ioc: IocContainer): void {
    ioc.bind<ISFeedbackService>(SFeedbackServiceTid).to(SFeedbackWebService).inSingletonScope();
    this._module.configure(ioc);
  }

  public init() {
    return this._module.init();
  }
}
