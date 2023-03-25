import { combineReducers, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApplicationContainerState, ApplicationState, BaseStateProperties } from 'store/types';
import { initialState } from 'store/initial-state';
import { baseReducers } from 'store/utils/baseReducers';
import { reducer as vehicleReducer } from './vehicle';
import { reducer as simpleCreditReducer } from './simpleCredit';

const { reducer: containerReducer, actions } = createSlice({
  name: 'application',
  initialState: initialState.application.container,
  reducers: {
    ...baseReducers,
    setApplication: (state, { payload }: PayloadAction<ApplicationContainerState>) => ({
      ...state,
      ...payload,
    }),
    setApplicationState: (state, { payload }: PayloadAction<BaseStateProperties & ApplicationContainerState>) => ({
      ...payload,
    }),
    setApprovedCreditExists: (state, { payload }: PayloadAction<boolean>) => ({
      ...state,
      approvedCreditExists: payload,
    }),
  },
});

const reducer = combineReducers<ApplicationState>({
  container: containerReducer,
  vehicle: vehicleReducer,
  simpleCredit: simpleCreditReducer,
});

export { reducer, actions };
