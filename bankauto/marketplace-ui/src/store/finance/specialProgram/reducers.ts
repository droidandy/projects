/* eslint-disable no-param-reassign */
import { BDASpecialOffer, VehicleShort } from '@marketplace/ui-kit/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { baseReducers } from 'store/utils/baseReducers';
import { initialState } from 'store/initial-state';
import { StateError } from 'store/types';

export const { reducer, actions } = createSlice({
  name: 'specialProgram',
  initialState: initialState.specialProgram,
  reducers: {
    setData: (state, action: PayloadAction<{ data: BDASpecialOffer; initial: boolean | null }>) => {
      state.data = action.payload.data;
      state.loading = false;
      state.initial = action.payload.initial;
    },
    setVehicles: (state, action: PayloadAction<{ data: VehicleShort[]; initial: boolean | null }>) => {
      state.vehicles = action.payload.data;
      state.loading = false;
      state.initial = action.payload.initial;
    },
    setErrorPage: (state, { payload: error }: PayloadAction<StateError | Error | null>) => {
      state.error = error instanceof Error ? { message: error.message } : error;
    },
    ...baseReducers,
  },
});
