import { SpecialOfferItem } from '@marketplace/ui-kit/types';
/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { baseReducers } from 'store/utils/baseReducers';
import { initialState } from 'store/initial-state';
import { StateError } from 'store/types';

export const { reducer, actions } = createSlice({
  name: 'specialPrograms',
  initialState: initialState.specialPrograms,
  reducers: {
    setItems: (state, action: PayloadAction<{ items: SpecialOfferItem[] | null; initial: boolean | null }>) => {
      state.items = action.payload.items;
      state.initial = action.payload.initial;
      state.loading = false;
    },
    setErrorPage: (state, { payload: error }: PayloadAction<StateError | Error | null>) => {
      state.error = error instanceof Error ? { message: error.message } : error;
    },
    ...baseReducers,
  },
});
