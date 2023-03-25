import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState } from 'store/initial-state';
import { baseReducers } from 'store/utils';
import { SimpleCreditStep } from 'containers/Finance/Credit/types/CreditFormTypes';

export const { reducer, actions } = createSlice({
  name: 'financeCreditStandalone',
  initialState: initialState.financeCreditStandalone,
  reducers: {
    ...baseReducers,
    setInitialPayment: (state, { payload }: PayloadAction<number>) => ({
      ...state,
      initialPayment: payload,
    }),
    setCreditTerm: (state, { payload }: PayloadAction<number>) => ({
      ...state,
      term: payload,
    }),
    setCreditAmount: (state, { payload }: PayloadAction<number>) => ({
      ...state,
      amount: payload,
    }),
    setVehiclePrice: (state, { payload }: PayloadAction<number>) => ({
      ...state,
      vehiclePrice: payload,
    }),
    setMonthlyPayment: (state, { payload }: PayloadAction<number>) => ({
      ...state,
      monthlyPayment: payload,
    }),
    setRate: (state, { payload }: PayloadAction<number>) => ({
      ...state,
      rate: payload,
    }),
    setCreditId: (state, { payload }: PayloadAction<{ id: number; uuid: string }>) => ({
      ...state,
      id: payload.id,
      uuid: payload.uuid,
    }),
    setCreditStep: (state, { payload }: PayloadAction<SimpleCreditStep>) => ({
      ...state,
      creditStep: payload,
    }),
    setUserSkippedAuth: (state, { payload }: PayloadAction<boolean>) => ({
      ...state,
      userSkippedAuth: payload,
    }),
  },
});
