/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CatalogBrandsShort } from '@marketplace/ui-kit/types';
import { initialState } from 'store/initial-state';
import { baseReducers } from 'store/utils/baseReducers';

export const { reducer, actions } = createSlice({
  name: 'instalmentBrands',
  initialState: initialState.instalmentBrands,
  reducers: {
    setVehiclesBrands: (
      state,
      { payload: { initial, brands } }: PayloadAction<{ brands: CatalogBrandsShort[]; initial: boolean | null }>,
    ) => {
      return {
        ...state,
        initial,
        loading: false,
        brands,
      };
    },
    ...baseReducers,
  },
});
