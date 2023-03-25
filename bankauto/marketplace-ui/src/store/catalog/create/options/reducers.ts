import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { baseReducers } from 'store/utils/baseReducers';
import { initialState } from 'store/initial-state';
import { VehicleFormOptions } from 'types/VehicleFormType';

export const { reducer, actions } = createSlice({
  name: 'vehicleCreateOptions',
  initialState: initialState.vehicleCreateOptions,
  reducers: {
    setOptions: (
      state,
      { payload: { options, initial } }: PayloadAction<{ options: VehicleFormOptions; initial: boolean | null }>,
    ) => ({
      ...state,
      options,
      loading: false,
      initial: !!initial,
    }),
    ...baseReducers,
  },
});
