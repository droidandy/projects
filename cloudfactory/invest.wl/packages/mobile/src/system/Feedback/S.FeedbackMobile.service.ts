import { Inject, Injectable } from '@invest.wl/core';
import { ISConfigStore, ISErrorService, ISFeedbackService, SConfigStoreTid, SErrorServiceTid, SFeedbackConfigTid } from '@invest.wl/system';
import { Linking, Platform } from 'react-native';
import InAppReview from 'react-native-in-app-review';
import { ISFeedbackMobileConfig } from './S.FeedbackMobile.types';

@Injectable()
export class SFeedbackMobileService implements ISFeedbackService {
  private _reviewInAppAvailable = InAppReview.isAvailable();

  constructor(
    @Inject(SFeedbackConfigTid) private _cfg: ISFeedbackMobileConfig,
    @Inject(SErrorServiceTid) private _errorService: ISErrorService,
    @Inject(SConfigStoreTid) private _cfgStore: ISConfigStore,
  ) {}

  public async review(score: number, message?: string) {
    try {
      if (this._reviewInAppAvailable && this._cfg.reviewInApp) await InAppReview.RequestInAppReview();
      else await Linking.openURL(this._reviewLink);
    } catch (e0) {
      try {
        await Linking.openURL(this._reviewLink);
      } catch (e: any) {
        throw this._errorService.systemHandle(e0);
      }
    }
  }

  public async bugReport(message: string) {
    // TODO: implement
    throw this._errorService.systemHandle(new Error('Not implemented'));
  }

  private get _reviewLink() {
    return Platform.OS === 'ios' ? this._cfgStore.feedbackReviewLinkIOS : this._cfgStore.feedbackReviewLinkAndroid;
  }
}

