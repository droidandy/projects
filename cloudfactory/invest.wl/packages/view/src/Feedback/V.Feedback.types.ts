import { IVFeedbackReviewPresentProps } from './present/V.FeedbackReview.present';

export enum EVFeedbackScreen {
  FeedbackReview = 'FeedbackReview',
}

export interface IVFeedbackScreenParams {
  FeedbackReview: IVFeedbackReviewPresentProps;
}
