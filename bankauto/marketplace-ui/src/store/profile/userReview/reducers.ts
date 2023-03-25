/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { baseReducers } from 'store/utils/baseReducers';
import { initialState } from 'store/initial-state';
import { Review } from 'types/Review';

export const { reducer, actions } = createSlice({
  name: 'userReview',
  initialState: initialState.userReview,
  reducers: {
    setUserReview: (
      state,
      { payload: { data, initial } }: PayloadAction<{ data: Review | null; initial?: boolean | null }>,
    ) => {
      state.data = data;
      state.initial = initial || null;
      state.loading = false;
    },
    ...baseReducers,
  },
});
