import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VehicleShort } from '@marketplace/ui-kit/types';
import { baseReducers } from 'store/utils/baseReducers';
import { initialState } from 'store/initial-state';

export const { reducer, actions } = createSlice({
  name: 'vehicleRelatives',
  initialState: initialState.vehicleRelatives,
  reducers: {
    setRelatives: (state, action: PayloadAction<{ items: VehicleShort[] | null; initial?: boolean | null }>) => {
      // eslint-disable-next-line no-param-reassign
      state.items = action.payload.items;
      // eslint-disable-next-line no-param-reassign
      state.initial = action.payload.initial || null;
      // eslint-disable-next-line no-param-reassign
      state.loading = false;
    },
    ...baseReducers,
  },
});
