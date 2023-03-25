/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState } from 'store/initial-state';
import { baseReducers } from 'store/utils';
import { DepositCalculatorState } from 'store/types';

export const { reducer, actions } = createSlice({
  name: 'depositCalculator',
  initialState: initialState.depositCalculator,
  reducers: {
    ...baseReducers,
    setAmount: (state, { payload }: PayloadAction<number>) => ({
      ...state,
      amount: payload,
    }),
    setTerm: (state, { payload }: PayloadAction<number>) => ({
      ...state,
      term: payload,
    }),
    setRefill: (state, { payload }: PayloadAction<boolean>) => ({
      ...state,
      refill: payload,
    }),
    setWithdrawal: (state, { payload }: PayloadAction<boolean>) => {
      state.withdrawal = payload;
      if (payload === true) {
        state.refill = true;
      }
    },
    setWithoutPercentWithdrawal: (state, { payload }: PayloadAction<boolean>) => ({
      ...state,
      withoutPercentWithdrawal: payload,
    }),
    setDepositRate: (state, { payload }: PayloadAction<Pick<DepositCalculatorState, 'depositRate' | 'addition'>>) => {
      state.depositRate = payload.depositRate;
      state.addition = payload.addition;
    },
  },
});
