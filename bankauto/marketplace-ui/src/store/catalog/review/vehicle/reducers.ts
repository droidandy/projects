/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { baseReducers } from 'store/utils/baseReducers';
import { initialState } from 'store/initial-state';
import { Review, ReviewsStats } from 'types/Review';

export const { reducer, actions } = createSlice({
  name: 'vehicleReview',
  initialState: initialState.vehicleReview,
  reducers: {
    setVehicleReviewStats: (state, action: PayloadAction<{ stats: ReviewsStats; initial: boolean | null }>) => {
      state.stats = action.payload.stats;
    },
    setVehicleReviews: (
      state,
      action: PayloadAction<{ reviews: Review[]; page: number; totalPages: number; initial: boolean | null }>,
    ) => {
      state.reviews = action.payload.reviews;
      state.currentPage = action.payload.page;
      state.totalPages = action.payload.totalPages;
    },
    ...baseReducers,
  },
});
