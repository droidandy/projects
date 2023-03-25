import { CurrentUserReviews, CurrentUserReviewsParams } from 'types/Review';
import API, { CancellableAxiosPromise } from 'api/request';

export const getUserReviews = ({
  id,
  page = 1,
  limit = 10,
}: CurrentUserReviewsParams): CancellableAxiosPromise<CurrentUserReviews> => {
  const params = {
    id,
    limit,
    offset: (page - 1) * limit,
  };

  return API.get<CurrentUserReviews>('/client/review/mine', params, { authRequired: true });
};
