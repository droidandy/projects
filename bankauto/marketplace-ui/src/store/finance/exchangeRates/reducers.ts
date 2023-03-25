import { ExchangeRates } from '@marketplace/ui-kit/types/';
/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { baseReducers } from 'store/utils/baseReducers';
import { initialState } from 'store/initial-state';
import { StateError } from 'store/types';

export const { reducer, actions } = createSlice({
  name: 'exchangeRates',
  initialState: initialState.exchangeRates,
  reducers: {
    setExchangeRates: (state, action: PayloadAction<{ rate: ExchangeRates; initial: boolean | null }>) => {
      state.rates = action.payload.rate;
      state.initial = action.payload.initial;
      state.loading = false;
    },
    setErrorPage: (state, { payload: error }: PayloadAction<StateError | Error | null>) => {
      state.error = error instanceof Error ? { message: error.message } : error;
    },
    ...baseReducers,
  },
});
