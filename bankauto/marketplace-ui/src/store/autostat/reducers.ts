import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { baseReducers } from 'store/utils';
import { initialState } from 'store/initial-state';
import { AutostatParamsAccurate, AutostatData, AutostatParams } from 'types/Autostat';

export const { reducer, actions } = createSlice({
  name: 'autostat',
  initialState: initialState.autostat,
  reducers: {
    setData: (
      state,
      { payload: { data, initial } }: PayloadAction<{ data: AutostatData; initial: boolean | null }>,
    ) => ({
      ...state,
      data,
      initial,
      loading: false,
    }),
    ...baseReducers,
    setParams: (
      state,
      { payload: { params, initial } }: PayloadAction<{ params: AutostatParams; initial: boolean | null }>,
    ) => ({
      ...state,
      params,
      paramsAccurate: null,
      initial,
    }),
    setParamsAccurate: (
      state,
      { payload: { params, initial } }: PayloadAction<{ params: AutostatParamsAccurate; initial: boolean | null }>,
    ) => ({
      ...state,
      params: null,
      paramsAccurate: params,
      initial,
    }),
    ...baseReducers,
  },
});
