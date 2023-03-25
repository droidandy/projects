import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { baseReducers } from 'store/utils/baseReducers';
import { initialState } from 'store/initial-state';
import { VehicleInstalmentListItem } from 'types/Vehicle';

export const { reducer, actions } = createSlice({
  name: 'instalmentRelatives',
  initialState: initialState.instalmentRelatives,
  reducers: {
    setRelatives: (
      state,
      action: PayloadAction<{ items: VehicleInstalmentListItem[] | null; initial?: boolean | null }>,
    ) => {
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
