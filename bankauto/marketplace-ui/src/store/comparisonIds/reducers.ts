/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { baseReducers } from 'store/utils/baseReducers';
import { initialState } from 'store/initial-state';
import { ComparisonIds } from '@marketplace/ui-kit/types';

export const { reducer, actions } = createSlice({
  name: 'comparisonIds',
  initialState: initialState.comparisonIds,
  reducers: {
    setData: (
      state,
      { payload: { data, initial = true } }: PayloadAction<{ data: ComparisonIds; initial?: boolean }>,
    ) => {
      state.data = data;
      state.initial = initial;
      state.loading = false;
    },
    ...baseReducers,
  },
});
