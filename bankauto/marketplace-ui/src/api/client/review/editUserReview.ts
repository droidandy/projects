import API, { CancellableAxiosPromise } from 'api/request';
import { CreateReviewParams } from 'types/Review';

export const editUserReview = (
  id: number | string,
  params: CreateReviewParams,
): CancellableAxiosPromise<{ message: string }> => {
  return API.put(`/client/review/${id}`, params, { authRequired: true });
};
