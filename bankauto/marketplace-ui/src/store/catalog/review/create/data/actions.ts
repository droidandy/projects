import { AsyncAction } from 'types/AsyncAction';
import { getCreateReviewData } from 'api/client/review/getCreateReviewData';
import { ReviewCreateFormData, ReviewCreateFormDataParams, ReviewCreateFormValue } from 'types/Review';
import { PrepareNewDataAndParams, PrepareNewParams } from './utils';
import { DataMapper, ValuesParamsMapper } from './mappers';
import { actions as createReviewDataActions } from './reducers';
import { initialState } from '../../../../initial-state';
import { actions as userReviewActions } from '../../../../profile/userReview';

export const fetchReviewCreateData =
  (params: ReviewCreateFormDataParams, setInitial?: boolean | null): AsyncAction<Promise<ReviewCreateFormData>> =>
  (dispatch, getState, { initial }) => {
    const {
      createReviewData: { data: previousData },
    } = getState();

    return getCreateReviewData(params)
      .then(async ({ data }) => {
        const mappedData = DataMapper(data);
        const payload = PrepareNewDataAndParams(mappedData, params, previousData);
        await dispatch(createReviewDataActions.setData({ ...payload, initial: initial || setInitial }));
        return payload.data;
      })
      .catch(async (err) => {
        await dispatch(createReviewDataActions.setError(err));
        throw new Error('Не удалось обновить данные формы');
      });
  };

export const updateData =
  (values: ReviewCreateFormValue): AsyncAction<Promise<ReviewCreateFormData | null>> =>
  (dispatch, getState) => {
    const {
      createReviewData: { params: previousParams },
    } = getState();

    const nextParams = ValuesParamsMapper(values);
    const { result: currentParams, chain: paramsIsEqual, dirty } = PrepareNewParams(previousParams, nextParams);
    if (!paramsIsEqual || !dirty) {
      return dispatch(fetchReviewCreateData(currentParams));
    }
    return new Promise((r) => r(null));
  };

export const clearReviewCreateData = (): AsyncAction<Promise<void>> => async (dispatch) => {
  await Promise.all([
    dispatch(
      createReviewDataActions.setData({
        data: initialState.createReviewData.data,
        params: initialState.createReviewData.params,
        initial: true,
      }),
    ),
    dispatch(userReviewActions.setUserReview({ data: initialState.userReview.data, initial: true })),
  ]);
};
