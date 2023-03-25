import { AsyncAction } from 'types/AsyncAction';
import { GetReviewsParams, ReviewsStatsParams } from 'types/Review';
import { getStatistics } from 'api/client/review/getStatistics';
import { getFilteredReviews } from 'api/client/review';
import { actions as vehicleReviewActions } from './reducers';

export const fetchVehicleReviewStats = (params: ReviewsStatsParams): AsyncAction => {
  return (dispatch, getState, { initial }) => {
    return getStatistics(params)
      .then(({ data }) => {
        dispatch(vehicleReviewActions.setVehicleReviewStats({ stats: data, initial }));
      })
      .catch((err) => {
        dispatch(vehicleReviewActions.setError(err));
      });
  };
};

export const fetchVehicleReviews = (params: GetReviewsParams): AsyncAction => {
  return (dispatch, getState, { initial }) => {
    const limit = params.limit || 10;
    const page = params.page || 1;
    return getFilteredReviews({ ...params, limit, page })
      .then(({ data }) => {
        dispatch(
          vehicleReviewActions.setVehicleReviews({
            reviews: data.data,
            page,
            totalPages: Math.ceil(data.pagination.total / limit),
            initial,
          }),
        );
      })
      .catch((err) => {
        dispatch(vehicleReviewActions.setError(err));
      });
  };
};
