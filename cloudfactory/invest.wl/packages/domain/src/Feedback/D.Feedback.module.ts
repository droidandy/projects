import { IocContainer, IocModule, NewableType } from '@invest.wl/core';
import { DFeedbackReviewCase, DFeedbackReviewCaseTid } from './case/D.FeedbackReview.case';
import { DFeedbackReviewModel, DFeedbackReviewModelTid, IDFeedbackReviewModel } from './model/D.FeedbackReview.model';

export class DFeedbackModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<DFeedbackReviewCase>(DFeedbackReviewCaseTid).to(DFeedbackReviewCase);
    ioc.bind<NewableType<IDFeedbackReviewModel>>(DFeedbackReviewModelTid).toConstructor<IDFeedbackReviewModel>(DFeedbackReviewModel);
  }
}
