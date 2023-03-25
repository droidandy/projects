import { createSlice } from '@reduxjs/toolkit';
import { APPLICATION_INSURANCE_TYPE, APPLICATION_INSURANCE_STATUS } from '@marketplace/ui-kit/types';
import { initialState } from 'store/initial-state';
import {
  REQUEST_INSURANCE_APPLICATION,
  RECEIVE_INSURANCE_APPLICATION,
  ERROR_INSURANCE_APPLICATION,
  REQUEST_INSURANCE_SERVICE,
  RECEIVE_INSURANCE_SERVICE,
  ERROR_INSURANCE_SERVICE,
  REQUEST_INSURANCE_PAYMENT_LINK,
  RECEIVE_INSURANCE_PAYMENT_LINK,
} from './types';

const { actions, reducer: insuranceApplicationReducer } = createSlice({
  name: 'insuranceApplication',
  initialState: initialState.insuranceApplication,
  reducers: {
    setInsuranceApplications: (state, action) => {
      state.application.insurance =
        action.payload &&
        action.payload.map((application: string) => ({
          id: 0,
          type: application,
          status: APPLICATION_INSURANCE_STATUS.NEW,
          applicationId: 0,
          discount: 0,
          vehicleId: 0,
          number: '',
        }));
    },
  },
  extraReducers: {
    [REQUEST_INSURANCE_APPLICATION]: (state) => {
      state.loading = true;
    },
    [ERROR_INSURANCE_APPLICATION]: (state, action) => {
      state.loading = false;
      state.initiated = false;
      state.error = action.payload;
    },
    [RECEIVE_INSURANCE_APPLICATION]: (state, action) => {
      state.loading = false;
      state.initiated = !!action.payload.id;
      state.error = null;
      state.application = action.payload;
    },
    [REQUEST_INSURANCE_SERVICE]: (state, action) => {
      state.services[action.payload as APPLICATION_INSURANCE_TYPE].loading = true;
      state.services[action.payload as APPLICATION_INSURANCE_TYPE].error = null;
    },
    [RECEIVE_INSURANCE_SERVICE]: (state, action) => {
      state.services[action.payload as APPLICATION_INSURANCE_TYPE].loading = false;
      state.services[action.payload as APPLICATION_INSURANCE_TYPE].error = null;
    },
    [ERROR_INSURANCE_SERVICE]: (state, action) => {
      state.services[action.payload.type as APPLICATION_INSURANCE_TYPE].loading = false;
      state.services[action.payload.type as APPLICATION_INSURANCE_TYPE].error = action.payload.error;
    },
    [REQUEST_INSURANCE_PAYMENT_LINK]: (state, action) => {
      state.services[action.payload as APPLICATION_INSURANCE_TYPE].paymentLinkLoading = true;
      state.services[action.payload as APPLICATION_INSURANCE_TYPE].paymentLink = '';
    },
    [RECEIVE_INSURANCE_PAYMENT_LINK]: (state, action) => {
      state.services[action.payload.type as APPLICATION_INSURANCE_TYPE].paymentLinkLoading = false;
      state.services[action.payload.type as APPLICATION_INSURANCE_TYPE].paymentLink = action.payload.link;
    },
  },
});

export { insuranceApplicationReducer, actions };
