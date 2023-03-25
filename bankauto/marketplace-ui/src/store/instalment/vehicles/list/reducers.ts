/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { baseReducers } from 'store/utils/baseReducers';
import { initialState } from 'store/initial-state';
import { VehicleSortType } from 'types/VehicleSortTypes';
import { StateError } from 'store/types';
import { VehicleInstalmentListItem } from 'types/Vehicle';

export const { reducer, actions } = createSlice({
  name: 'instalmentList',
  initialState: initialState.instalmentList,
  reducers: {
    setItems: (
      state,
      action: PayloadAction<{ items: VehicleInstalmentListItem[]; page?: number; initial: boolean | null }>,
    ) => {
      state.items = action.payload.items;
      state.currentPage = action.payload.page || 1;
      state.initial = action.payload.initial;
      state.loading = false;
    },
    addItems: (state, action: PayloadAction<VehicleInstalmentListItem[]>) => {
      state.items = [...state.items, ...action.payload];
      state.currentPage += 1;
      state.loadingPage = false;
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
