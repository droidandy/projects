import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { baseReducers } from 'store/utils/baseReducers';
import { initialState } from 'store/initial-state';
import { ReviewCreateFormData, ReviewFilterDataParams } from 'types/Review';

export const { reducer, actions } = createSlice({
  name: 'createReviewData',
  initialState: initialState.createReviewData,
  reducers: {
    setData: (
      state,
      {
        payload: { data, params, initial },
      }: PayloadAction<{
        data: ReviewCreateFormData;
        params?: ReviewFilterDataParams;
        initial?: boolean | null;
      }>,
    ) => ({
      ...state,
      data,
      params: params || state.params,
      loading: false,
      initial: typeof initial === 'undefined' ? false : initial,
    }),
    ...baseReducers,
  },
});
