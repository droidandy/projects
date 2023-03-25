/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState } from 'store/initial-state';
import { HomeTab } from 'types/Home';
import { baseReducers } from 'store/utils';
import { VehiclesMetaData } from '@marketplace/ui-kit/types';

export const { reducer, actions } = createSlice({
  name: 'home',
  initialState: initialState.home,
  reducers: {
    setTabState: (state, action: PayloadAction<{ tab: HomeTab; initial: boolean | null }>) => ({
      ...state,
      activeTab: action.payload.tab,
      initial: action.payload.initial,
    }),
    setMeta: (state, action: PayloadAction<{ meta: VehiclesMetaData; initial: boolean | null }>) => ({
      ...state,
      meta: { vehiclesCount: action.payload?.meta.count },
      initial: action.payload.initial,
      loading: false,
    }),
    ...baseReducers,
  },
});
