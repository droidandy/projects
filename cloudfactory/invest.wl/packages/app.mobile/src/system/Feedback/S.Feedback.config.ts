import { Injectable } from '@invest.wl/core';
import { ISFeedbackMobileConfig } from '@invest.wl/mobile';

@Injectable()
export class SFeedbackConfig implements ISFeedbackMobileConfig {
  public reviewInApp = false;
}
