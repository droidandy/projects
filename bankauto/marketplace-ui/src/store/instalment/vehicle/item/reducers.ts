/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { baseReducers } from 'store/utils/baseReducers';
import { initialState } from 'store/initial-state';
import { VehicleInstalmentItem } from 'types/Vehicle';

export const { reducer, actions } = createSlice({
  name: 'instalmentOffer',
  initialState: initialState.instalmentOffer,
  reducers: {
    setVehicle: (state, action: PayloadAction<{ vehicle: VehicleInstalmentItem; initial: boolean | null }>) => {
      state.vehicle = action.payload.vehicle;
      state.initial = action.payload.initial;
      state.loading = false;
    },
    ...baseReducers,
  },
});
