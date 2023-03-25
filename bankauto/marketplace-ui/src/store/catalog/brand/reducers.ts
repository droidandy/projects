import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CatalogBrand, VEHICLE_TYPE } from '@marketplace/ui-kit/types';
import { initialState } from 'store/initial-state';
import { baseReducers } from 'store/utils/baseReducers';

export const { reducer, actions } = createSlice({
  name: 'brand',
  initialState: initialState.brand,
  reducers: {
    setBrandData: (
      state,
      {
        payload,
      }: PayloadAction<{
        brand: CatalogBrand & {
          type: VEHICLE_TYPE;
        };
        initial: boolean | null;
      }>,
    ) => ({
      ...state,
      ...payload,
      loading: false,
    }),
    ...baseReducers,
  },
});
