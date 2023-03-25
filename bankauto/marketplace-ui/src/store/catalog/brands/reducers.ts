/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CatalogBrandsShort, VEHICLE_TYPE } from '@marketplace/ui-kit/types';
import { initialState } from 'store/initial-state';
import { baseReducers } from 'store/utils/baseReducers';

export const { reducer, actions } = createSlice({
  name: 'brandsNew',
  initialState: initialState.brandsNew,
  reducers: {
    setVehiclesBrands: (
      state,
      {
        payload: { type, initial, brands },
      }: PayloadAction<{ type: VEHICLE_TYPE | 'all'; brands: CatalogBrandsShort[]; initial: boolean | null }>,
    ) => ({
      ...state,
      initial,
      loading: false,
      brands: {
        ...state.brands,
        [type]: brands,
      },
    }),
    ...baseReducers,
  },
});
