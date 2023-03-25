import API, { CancellableAxiosPromise } from '../../request';
import { ReviewsStats, ReviewsStatsParams } from 'types/Review';

export const getStatistics = (params: ReviewsStatsParams): CancellableAxiosPromise<ReviewsStats> => {
  return API.get('/client/review/stats', params);
};
