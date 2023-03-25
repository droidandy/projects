import { getUserReviews, removeUserReview as removeUserReviewApi } from 'api/client/review';
import { Router } from 'next/router';
import { notify, notifyError } from 'store/notifications';
import { AsyncAction } from 'types/AsyncAction';
import { actions as userReviewsActions } from './reducers';

export const fetchUserReviews =
  (page = 1, limit = 10): AsyncAction =>
  (dispatch) => {
    dispatch(userReviewsActions.setLoading(true));
    return getUserReviews({ page, limit })
      .then(({ data }) => {
        dispatch(
          userReviewsActions.setUserReviews({
            items: data.data,
            page,
            totalPages: Math.ceil(data.pagination.total / limit),
            initial: true,
          }),
        );
      })
      .catch((err) => {
        dispatch(userReviewsActions.setError(err));
      });
  };

export const removeUserReview =
  (id: number | string, push: Router['push']): AsyncAction =>
  (dispatch, getState) => {
    dispatch(userReviewsActions.setLoading(true));
    return removeUserReviewApi(id)
      .then(({ data }) => {
        notify(data.message);
        const {
          userReviews: { currentPage, pageLimit, items },
        } = getState();

        const needChangePage = items.length === 1 && currentPage > 1;

        if (needChangePage) {
          push({
            pathname: window.location.pathname,
            query: {
              page: currentPage - 1,
            },
          });
        } else {
          return dispatch(fetchUserReviews(currentPage, pageLimit));
        }
      })
      .catch((e) => {
        dispatch(notifyError(e));
        dispatch(userReviewsActions.setError(e));
        throw e;
      })
      .finally(() => {
        dispatch(userReviewsActions.setLoading(false));
      });
  };
