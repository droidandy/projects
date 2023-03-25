import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { baseReducers } from 'store/utils/baseReducers';
import { initialState } from 'store/initial-state';

export const { reducer, actions } = createSlice({
  name: 'serviceRequest',
  initialState: initialState.serviceRequest,
  reducers: {
    setValues: (state, { payload: { values, initial } }: PayloadAction<{ values: any; initial: boolean | null }>) => ({
      ...state,
      values,
      loading: false,
      initial: !!initial,
    }),
    setStep: (state, { payload: { step } }: PayloadAction<{ step: number | string }>) => ({
      ...state,
      step,
    }),
    ...baseReducers,
  },
});
