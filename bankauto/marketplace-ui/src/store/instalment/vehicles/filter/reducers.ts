/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VehiclesFilterValues } from 'types/VehiclesFilterValues';
import { VehicleSortType } from 'types/VehicleSortTypes';
import { baseReducers } from 'store/utils/baseReducers';
import { initialState } from 'store/initial-state';

export const { reducer, actions } = createSlice({
  name: 'instalmentFilter',
  initialState: initialState.instalmentFilter,
  reducers: {
    setValues: (state, action: PayloadAction<{ values: VehiclesFilterValues; initial: boolean | null }>) => {
      state.values = action.payload.values;
      if (action.payload.initial) {
        state.initial = action.payload.initial;
      }
    },
    setData: (state, action: PayloadAction<{ data: any; initial: boolean | null }>) => {
      state.data = action.payload.data;
      state.initial = action.payload.initial;
      state.loading = false;
    },
    setSort: (state, action: PayloadAction<{ sortType: VehicleSortType }>) => {
      state.sort = action.payload.sortType;
      state.initial = false;
    },
    ...baseReducers,
  },
});
