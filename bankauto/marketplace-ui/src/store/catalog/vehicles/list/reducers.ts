/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VehicleShort } from '@marketplace/ui-kit/types';
import { baseReducers } from 'store/utils/baseReducers';
import { initialState } from 'store/initial-state';
import { VehicleSortType } from 'types/VehicleSortTypes';
import { StateError } from 'store/types';

export const { reducer, actions } = createSlice({
  name: 'vehiclesList',
  initialState: initialState.vehiclesList,
  reducers: {
    setItems: (state, action: PayloadAction<{ items: VehicleShort[]; page?: number; initial: boolean | null }>) => {
      state.items = action.payload.items;
      state.currentPage = action.payload.page || 1;
      state.initial = action.payload.initial;
      state.loading = false;
    },
    setSorting: (state, action: PayloadAction<VehicleSortType>) => {
      state.sorting = action.payload;
    },
    setLoadingPage: (state, action: PayloadAction<boolean>) => {
      state.loadingPage = action.payload;
    },
    setErrorPage: (state, { payload: error }: PayloadAction<StateError | Error | null>) => {
      state.errorPage = error instanceof Error ? { message: error.message } : error;
      state.loadingPage = false;
    },
    ...baseReducers,
  },
});
