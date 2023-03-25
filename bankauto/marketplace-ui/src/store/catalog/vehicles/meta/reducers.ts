/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { baseReducers } from 'store/utils/baseReducers';
import { initialState } from 'store/initial-state';
import { VehiclesMetaData } from 'types/VehicleMeta';

export const { reducer, actions } = createSlice({
  name: 'vehiclesMeta',
  initialState: initialState.vehiclesMeta,
  reducers: {
    setMeta: (state, action: PayloadAction<{ meta: VehiclesMetaData; initial: boolean | null }>) => {
      state.meta = action.payload.meta;
      state.initial = action.payload.initial;
      state.loading = false;
    },
    ...baseReducers,
  },
});
