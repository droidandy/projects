/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SingleApplication } from 'types/SingleApplication';
import { AuthSteps, RegistrationTypes } from 'types/Authentication';
import { CreditFisCreateParams } from 'types/CreditFis';
import { CreateCreditApplicationParamsDTO } from 'dtos/CreateCreditApplicationParamsDTO';
import { CreateInstalmentApplicationParamsDTO } from 'dtos/CreateInstalmentApplicationParamsDTO';
import { StateSession, StateUserType } from './types';

export const initialStateSession: StateSession = {
  user: {
    id: 0,
    uuid: '',
    firstName: '',
    lastName: '',
    patronymicName: '',
    phone: '',
    email: '',
    authModalC2COpen: false,
    callbackApplicationParams: null,
    permissions: [],
    roles: [],
    expiresIn: 0,
    authModalOpen: false,
    authStep: AuthSteps.DEFAULT,
    onAuthRedirect: '',
    authModalTitle: '',
    authModalText: '',
    impersonalizated: false,
    isAuthorized: null,
    isRegistered: null,
    isEmailVerified: false,
    isPhoneVerified: false,
    shouldAutoSendSms: true,
    phoneEditable: true,
    cityId: null,
    isLogout: false,
  },
};

export const { reducer, actions } = createSlice({
  name: 'user',
  initialState: initialStateSession.user,
  reducers: {
    authorizeUser(state, action: PayloadAction<{ expiresIn: number; impersonalizated?: boolean }>) {
      state.expiresIn = action.payload.expiresIn;
      state.impersonalizated = action.payload.impersonalizated || false;
      state.authorizationError = undefined;
    },
    unauthorizeUser(state) {
      Object.assign(state, initialStateSession.user);
      state.isAuthorized = false;
      state.authorizationError = undefined;
      state.isLogout = true;
    },
    setError(state, action: PayloadAction<Error | undefined>) {
      state.isAuthorized = false;
      state.authorizationError = action.payload;
    },
    fillUser(state, action: PayloadAction<StateUserType>) {
      Object.assign(state, action.payload);
      state.isAuthorized = true;
      state.authorizationError = undefined;
    },
    setCallbackApplicationParams(
      state,
      action: PayloadAction<{
        applicationParams: SingleApplication | CreateCreditApplicationParamsDTO | CreateInstalmentApplicationParamsDTO;
        creditParams?: CreditFisCreateParams;
        acquiringBookingParams?: number;
      }>,
    ) {
      state.callbackApplicationParams = action.payload;
    },
    removeStoreApplicationParams(state) {
      state.callbackApplicationParams = null;
    },
    setLogout(state, action: PayloadAction<boolean>) {
      state.isLogout = action.payload;
    },
    changeAuthModalVisibility(
      state,
      action: PayloadAction<{
        authModalOpen: boolean;
        options: {
          authModalTitle?: string;
          authModalText?: string;
          additionalButtonText?: string;
          additionalButtonOnClick?: () => void;
          onCloseCallback?: (isAuthorized: boolean) => void;
          regType?: RegistrationTypes;
          shouldAutoSendSms?: boolean;
          phoneEditable?: boolean;
        };
      }>,
    ) {
      const { shouldAutoSendSms = false, phoneEditable = true } = action.payload.options;
      state.authModalOpen = action.payload.authModalOpen;
      state.authModalTitle = action.payload.options.authModalTitle || '';
      state.authModalText = action.payload.options.authModalText || '';
      state.additionalButtonText = action.payload.options.additionalButtonText;
      state.additionalButtonOnClick = action.payload.options.additionalButtonOnClick;
      state.onCloseCallback = action.payload.options.onCloseCallback;
      state.regType = action.payload.options.regType;
      state.shouldAutoSendSms = shouldAutoSendSms;
      state.phoneEditable = phoneEditable;
    },
    setAuthStep(state, action: PayloadAction<AuthSteps>) {
      state.authStep = action.payload;
    },
    setUserPhone(state, action: PayloadAction<string>) {
      state.phone = action.payload;
    },
    setUserName(state, action: PayloadAction<string>) {
      state.firstName = action.payload;
    },
    setOnAuthRedirect(state, action: PayloadAction<string>) {
      state.onAuthRedirect = action.payload;
    },
    removeOnAuthRedirect(state) {
      state.onAuthRedirect = '';
    },
    changeAuthModalC2CVisibility(state, action: PayloadAction<boolean>) {
      state.authModalC2COpen = action.payload;
    },
  },
});
