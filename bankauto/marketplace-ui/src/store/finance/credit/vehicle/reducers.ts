import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { CreditStep } from 'containers/Finance/Credit/types/CreditFormTypes';

import { initialState } from 'store/initial-state';
import { baseReducers } from 'store/utils';

export const { reducer, actions } = createSlice({
  name: 'financeCreditVehicle',
  initialState: initialState.financeCreditVehicle,
  reducers: {
    ...baseReducers,
    setCreditApplication: (state, { payload }: PayloadAction<any>) => ({
      ...state,
      ...payload,
    }),
    setInitialPayment: (state, { payload }: PayloadAction<number>) => ({
      ...state,
      initialPayment: payload,
    }),
    setCreditTerm: (state, { payload }: PayloadAction<number>) => ({
      ...state,
      term: payload,
    }),
    setCreditRate: (state, { payload }: PayloadAction<number>) => ({
      ...state,
      rate: payload,
    }),
    setCreditAmount: (state, { payload }: PayloadAction<number>) => ({
      ...state,
      amount: payload,
    }),
    setCreditMonthlyPayment: (state, { payload }: PayloadAction<number>) => ({
      ...state,
      monthlyPayment: payload,
    }),
    setVehiclePrice: (state, { payload }: PayloadAction<number>) => ({
      ...state,
      vehiclePrice: payload,
    }),
    setCreditStep: (state, { payload }: PayloadAction<CreditStep>) => ({
      ...state,
      creditStep: payload,
    }),
    setUserSkippedAuth: (state, { payload }: PayloadAction<boolean>) => ({
      ...state,
      userSkippedAuth: payload,
    }),
  },
});
