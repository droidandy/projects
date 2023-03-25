/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Partners } from '@marketplace/ui-kit/types';
import { baseReducers } from 'store/utils/baseReducers';
import { initialState } from 'store/initial-state';

export const { reducer, actions } = createSlice({
  name: 'dealerPartners',
  initialState: initialState.dealerPartners,
  reducers: {
    setPartners: (state, action: PayloadAction<{ partners: Partners; initial: boolean | null }>) => {
      state.partners = action.payload.partners;
      state.initial = action.payload.initial;
      state.loading = false;
    },
    ...baseReducers,
  },
});
