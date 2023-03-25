/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AdvertiseList } from '@marketplace/ui-kit/types';
import { initialState } from 'store/initial-state';
import { baseReducers } from 'store/utils/baseReducers';

export const { reducer, actions } = createSlice({
  name: 'advertiseList',
  initialState: initialState.advertiseList,
  reducers: {
    setAdvertiseList: (state, { payload }: PayloadAction<AdvertiseList>) => ({
      ...state,
      ...payload,
      loading: false,
    }),
    ...baseReducers,
  },
});
