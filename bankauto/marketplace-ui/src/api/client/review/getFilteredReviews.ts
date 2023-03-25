import { FilteredReviews, GetReviewsParams } from 'types/Review';
import API, { CancellableAxiosPromise } from 'api/request';

export const getFilteredReviews = ({
  page = 1,
  limit = 10,
  ...rest
}: GetReviewsParams): CancellableAxiosPromise<FilteredReviews> => {
  const params = {
    limit,
    offset: (page - 1) * limit,
    ...rest,
  };

  return API.get<FilteredReviews>('/client/review/filter', params);
};
