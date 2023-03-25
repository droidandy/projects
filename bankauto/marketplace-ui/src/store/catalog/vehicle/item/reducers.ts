/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VehicleNew } from '@marketplace/ui-kit/types';
import { baseReducers } from 'store/utils/baseReducers';
import { initialState } from 'store/initial-state';
import { ColorChooseItem } from 'types/VehicleChooseColor';

export const { reducer, actions } = createSlice({
  name: 'vehicleItem',
  initialState: initialState.vehicleItem,
  reducers: {
    setColorsData: (state, action: PayloadAction<ColorChooseItem[] | null>) => {
      state.availableColors = action.payload;
    },
    setColorValue: (state, action: PayloadAction<ColorChooseItem | null>) => {
      state.pickedColor = action.payload;
    },
    setVehicle: (state, action: PayloadAction<{ vehicle: VehicleNew; initial: boolean | null }>) => {
      state.vehicle = action.payload.vehicle;
      state.initial = action.payload.initial;
      state.loading = false;
    },
    ...baseReducers,
  },
});
