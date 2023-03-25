import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { baseReducers } from 'store/utils/baseReducers';
import { initialState } from 'store/initial-state';
import { VehicleFormSellValues } from 'types/VehicleFormType';

export const { reducer, actions } = createSlice({
  name: 'vehicleCreateSellValues',
  initialState: initialState.vehicleCreateSellValues,
  reducers: {
    setValues: (
      state,
      { payload: { values, initial } }: PayloadAction<{ values: VehicleFormSellValues; initial: boolean | null }>,
    ) => ({
      ...state,
      values,
      loading: false,
      initial: !!initial,
    }),
    ...baseReducers,
  },
});
