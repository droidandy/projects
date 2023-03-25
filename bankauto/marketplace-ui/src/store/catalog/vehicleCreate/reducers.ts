/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState } from 'store/initial-state';
import { baseReducers } from 'store/utils/baseReducers';
import { CreateVehicleOptions, VEHICLE_SCENARIO } from '@marketplace/ui-kit/types';
import { CreateVehicleContacts, CreateVehicleData, CreateVehicleValues } from 'types/VehicleCreateNew';

export const { reducer, actions } = createSlice({
  name: 'vehicleCreate',
  initialState: initialState.vehicleCreate,
  reducers: {
    setData: (
      state,
      {
        payload,
      }: PayloadAction<{
        data: CreateVehicleData;
        initial: boolean | null;
      }>,
    ) => ({
      ...state,
      data: {
        ...state.data,
        ...payload.data,
      },
      loading: false,
    }),
    setDataOptions: (
      state,
      {
        payload,
      }: PayloadAction<{
        options: CreateVehicleOptions;
        initial: boolean | null;
      }>,
    ) => {
      state.data.optionGroups = payload.options.optionGroups;
    },
    setValues: (
      state,
      {
        payload,
      }: PayloadAction<{
        values: CreateVehicleValues;
        lastUpdated?: keyof CreateVehicleValues | null;
        valid?: boolean | null;
      }>,
    ) => ({
      ...state,
      values: {
        ...state.values, // to prevent options rewrite
        ...payload.values,
      },
      lastUpdated: payload.lastUpdated || state.lastUpdated,
      valid: typeof payload.valid === 'undefined' ? state.valid : payload.valid,
    }),
    setContacts: (
      state,
      {
        payload,
      }: PayloadAction<{
        values: CreateVehicleContacts;
        valid?: boolean | null;
      }>,
    ) => ({
      ...state,
      contacts: payload.values,
      contactsValid: typeof payload.valid === 'undefined' ? state.contactsValid : payload.valid,
    }),
    setScenario: (state, { payload }: PayloadAction<{ scenario: VEHICLE_SCENARIO }>) => ({
      ...state,
      scenario: payload.scenario,
    }),
    setInitialData: () => ({ ...initialState.vehicleCreate }),
    ...baseReducers,
  },
});
