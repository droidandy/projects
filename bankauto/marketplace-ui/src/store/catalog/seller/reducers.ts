/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Seller } from '@marketplace/ui-kit/types';
import { baseReducers } from 'store/utils/baseReducers';
import { initialState } from 'store/initial-state';

export const { reducer, actions } = createSlice({
  name: 'sellerInfo',
  initialState: initialState.sellerInfo,
  reducers: {
    setSellerInfo: (state, action: PayloadAction<{ info: Seller; initial: boolean | null }>) => {
      state.info = action.payload.info;
      state.initial = action.payload.initial;
      state.loading = false;
    },
    ...baseReducers,
  },
});
