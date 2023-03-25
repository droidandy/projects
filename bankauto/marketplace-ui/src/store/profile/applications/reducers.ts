import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { C2cApplicationShort, InstalmentApplicationShort, VehicleApplicationShort } from '@marketplace/ui-kit/types';
import { baseReducers } from 'store/utils/baseReducers';
import { initialState } from 'store/initial-state';

export const { reducer, actions } = createSlice({
  name: 'applications',
  initialState: initialState.applications,
  reducers: {
    setItems: (
      state,
      action: PayloadAction<{ items: (VehicleApplicationShort | InstalmentApplicationShort | C2cApplicationShort)[] }>,
    ) => ({
      ...state,
      items: action.payload.items,
      initial: true,
      loading: false,
    }),
    ...baseReducers,
  },
});
