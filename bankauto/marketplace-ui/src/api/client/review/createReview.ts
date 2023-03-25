import API, { CancellableAxiosPromise } from '../../request';
import { CreateReview, CreateReviewParams } from 'types/Review';

export const createReview = (params: CreateReviewParams): CancellableAxiosPromise<CreateReview> => {
  return API.post('/client/review/add', params, {
    authRequired: true,
  });
};
