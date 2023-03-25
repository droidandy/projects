import { IocContainer, IocModule, NewableType } from '@invest.wl/core';
import { IVFeedbackReviewModel, VFeedbackReviewModel, VFeedbackReviewModelTid } from './model/V.FeedbackReview.model';
import { VFeedbackReviewPresent, VFeedbackReviewPresentTid } from './present/V.FeedbackReview.present';

export class VFeedbackModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<VFeedbackReviewPresent>(VFeedbackReviewPresentTid).to(VFeedbackReviewPresent);
    ioc.bind<NewableType<IVFeedbackReviewModel>>(VFeedbackReviewModelTid).toConstructor<IVFeedbackReviewModel>(VFeedbackReviewModel);
  }
}
