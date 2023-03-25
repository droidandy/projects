/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { baseReducers } from 'store/utils/baseReducers';
import { initialState } from 'store/initial-state';
import { StateError } from 'store/types';
import { DebitCardSmall } from '../../types';

export const { reducer, actions } = createSlice({
  name: 'debitCards',
  initialState: initialState.debitCards,
  reducers: {
    setItems: (state, action: PayloadAction<{ items: DebitCardSmall[] | null; initial: boolean | null }>) => {
      state.items = action.payload.items;
      state.initial = action.payload.initial;
      state.loading = false;
      state.loading = false;
    },
    setItem: (state, action: PayloadAction<{ item: DebitCardSmall | null; initial: boolean | null }>) => {
      state.item = action.payload.item;
      state.initial = action.payload.initial;
      state.loading = false;
    },
    setErrorPage: (state, { payload: error }: PayloadAction<StateError | Error | null>) => {
      state.error = error instanceof Error ? { message: error.message } : error;
    },
    ...baseReducers,
  },
});
