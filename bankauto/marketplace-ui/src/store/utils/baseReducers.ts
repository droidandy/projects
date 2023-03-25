/* eslint-disable no-param-reassign */
import { PayloadAction } from '@reduxjs/toolkit';
import { BaseStateProperties, StateError } from 'store/types';

export const baseReducers = {
  setInitial: (state: BaseStateProperties, action: PayloadAction<boolean>) => {
    state.initial = action.payload;
  },
  setLoading: (state: BaseStateProperties, action: PayloadAction<boolean>) => {
    state.loading = action.payload;
    state.error = null;
  },
  setError: (state: BaseStateProperties, { payload: error }: PayloadAction<StateError | Error | null>) => {
    state.error = error instanceof Error ? { message: error.message } : error;
    state.loading = false;
  },
};
