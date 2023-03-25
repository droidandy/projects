/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { initialState } from 'store/initial-state';
import { baseReducers } from 'store/utils';

export const { reducer, actions } = createSlice({
  name: 'depositSubmit',
  initialState: initialState.depositSubmit,
  reducers: {
    ...baseReducers,
  },
});
