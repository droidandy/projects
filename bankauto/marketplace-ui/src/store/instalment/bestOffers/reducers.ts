/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { baseReducers } from 'store/utils/baseReducers';
import { initialState } from 'store/initial-state';
import { StateError } from 'store/types';
import { VehicleInstalmentListItem } from 'types/Vehicle';

export const { reducer, actions } = createSlice({
  name: 'instalmentBestOffers',
  initialState: initialState.instalmentBestOffers,
  reducers: {
    setItems: (state, action: PayloadAction<{ items: VehicleInstalmentListItem[]; initial: boolean | null }>) => {
      state.items = action.payload.items;
      state.initial = action.payload.initial;
      state.loading = false;
    },
    setErrorPage: (state, { payload: error }: PayloadAction<StateError | Error | null>) => {
      state.error = error instanceof Error ? { message: error.message } : error;
    },
    ...baseReducers,
  },
});
