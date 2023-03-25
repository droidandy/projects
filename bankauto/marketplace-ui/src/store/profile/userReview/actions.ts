import { AsyncAction } from 'types/AsyncAction';
import { getUserReviews } from 'api/client/review';
import { actions as userReviewActions } from './reducers';

export const fetchUserReview =
  (id: number | string): AsyncAction =>
  (dispatch, getState, { initial }) => {
    dispatch(userReviewActions.setLoading(true));
    return getUserReviews({ id: +id })
      .then(({ data }) => {
        const review = data.data[0];
        dispatch(userReviewActions.setUserReview({ data: review, initial }));
      })
      .catch((err) => {
        dispatch(userReviewActions.setError(err));
      });
  };
