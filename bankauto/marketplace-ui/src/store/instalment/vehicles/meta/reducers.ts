/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { baseReducers } from 'store/utils/baseReducers';
import { initialState } from 'store/initial-state';
import { InstalmentVehiclesMeta } from 'types/Vehicle';

export const { reducer, actions } = createSlice({
  name: 'instalmentMeta',
  initialState: initialState.instalmentMeta,
  reducers: {
    setMeta: (state, action: PayloadAction<{ meta: InstalmentVehiclesMeta; initial: boolean | null }>) => {
      state.meta = action.payload.meta;
      state.initial = action.payload.initial;
      state.loading = false;
    },
    ...baseReducers,
  },
});
