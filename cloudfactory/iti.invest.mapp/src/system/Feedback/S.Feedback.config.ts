import { Injectable } from '@invest.wl/core/src/di/IoC';
import { ISFeedbackMobileConfig } from '@invest.wl/mobile/src/system/Feedback/S.FeedbackMobile.types';

@Injectable()
export class SFeedbackConfig implements ISFeedbackMobileConfig {
  public reviewInApp = false;
}
