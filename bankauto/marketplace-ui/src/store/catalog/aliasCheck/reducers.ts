import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { baseReducers } from 'store/utils/baseReducers';
import { initialState } from 'store/initial-state';
import { VehicleAlias } from 'types/VehicleAlias';

export const { reducer, actions } = createSlice({
  name: 'aliasCheck',
  initialState: initialState.aliasCheck,
  reducers: {
    setAliasCheck: (
      state,
      action: PayloadAction<{
        brand: VehicleAlias | null;
        model: VehicleAlias | null;
        generation: VehicleAlias | null;
      } | null>,
    ) => {
      // eslint-disable-next-line no-param-reassign
      state.data = action.payload;
    },
    ...baseReducers,
  },
});
