import { Injectable } from '@invest.wl/core';
import { ISFeedbackMobileConfig } from './S.FeedbackMobile.types';

@Injectable()
export class SFeedbackMobileConfig implements ISFeedbackMobileConfig {
  public reviewInApp = false;
}
