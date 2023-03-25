import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { initialState } from 'store/initial-state';
import { SimpleCreditState } from 'store/types';
import { baseReducers } from 'store/utils';
import { APPLICATION_CREDIT_STATUS } from '@marketplace/ui-kit/types';

export const { reducer, actions } = createSlice({
  name: 'applicationSimpleCredit',
  initialState: initialState.application.simpleCredit,
  reducers: {
    ...baseReducers,
    setSimpleCreditApplication: (state, { payload }: PayloadAction<SimpleCreditState>) => ({
      ...state,
      ...payload,
    }),
    setCreditStatus: (state, { payload }: PayloadAction<APPLICATION_CREDIT_STATUS>) => ({
      ...state,
      status: payload,
    }),
  },
});
