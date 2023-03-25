import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VehicleShort } from '@marketplace/ui-kit/types';
import { baseReducers } from 'store/utils/baseReducers';
import { initialState } from 'store/initial-state';

export const { reducer, actions } = createSlice({
  name: 'favourites',
  initialState: initialState.favourites,
  reducers: {
    setItems: (
      state,
      { payload: { items, initial = true } }: PayloadAction<{ items: VehicleShort[]; initial?: boolean }>,
    ) => ({
      ...state,
      items,
      initial,
      loading: false,
    }),
    ...baseReducers,
  },
});
