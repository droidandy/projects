/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VehicleComparisonNew, VehiclesComparisonNew } from '@marketplace/ui-kit/types';
import { baseReducers } from 'store/utils/baseReducers';
import { initialState } from 'store/initial-state';

export const { reducer, actions } = createSlice({
  name: 'comparisonVehiclesNew',
  initialState: initialState.comparisonVehiclesNew,
  reducers: {
    setItems: (state, { payload: { items } }: PayloadAction<{ items: VehicleComparisonNew[] }>) => {
      state.items = items;
      state.loading = false;
    },
    setData: (
      state,
      { payload: { data, initial = true } }: PayloadAction<{ data: VehiclesComparisonNew; initial?: boolean }>,
    ) => {
      state.items = data.vehicles;
      state.optionsMap = data.optionsMap;
      state.initial = initial;
      state.loading = false;
    },
    ...baseReducers,
  },
});
