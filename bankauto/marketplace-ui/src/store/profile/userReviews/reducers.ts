/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { baseReducers } from 'store/utils/baseReducers';
import { initialState } from 'store/initial-state';
import { CurrentUserReview } from 'types/Review';

export const { reducer, actions } = createSlice({
  name: 'userReviews',
  initialState: initialState.userReviews,
  reducers: {
    setUserReviews: (
      state,
      action: PayloadAction<{ items: CurrentUserReview[]; page: number; totalPages: number; initial?: boolean | null }>,
    ) => {
      state.items = action.payload.items;
      state.currentPage = action.payload.page;
      state.totalPages = action.payload.totalPages;
      state.initial = action.payload.initial || null;
      state.loading = false;
    },
    ...baseReducers,
  },
});
