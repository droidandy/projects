/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState } from 'store/initial-state';
import { baseReducers } from 'store/utils';
import { City } from 'types/City';

export const { reducer, actions } = createSlice({
  name: 'city',
  initialState: initialState.city,
  reducers: {
    setCurrentCity: (state, action: PayloadAction<{ city: City; initial: boolean | null }>) => ({
      ...state,
      current: action.payload.city,
      initial: action.payload.initial,
    }),
    setCityList: (
      state,
      action: PayloadAction<{ cities: { primary: City[]; secondary: City[] }; initial: boolean | null }>,
    ) => {
      return {
        ...state,
        list: action.payload.cities,
        initial: action.payload.initial,
        loading: false,
      };
    },
    setCityModalOpen: (state, action: PayloadAction<{ initial: boolean | null; isCityModalOpen: boolean }>) => ({
      ...state,
      initial: action.payload.initial,
      isCityModalOpen: action.payload.isCityModalOpen,
    }),
    setShowCityConfirmation: (state, { payload }: PayloadAction<boolean>) => ({
      ...state,
      showCityConfirmation: payload,
    }),
    setExtraCoverageRadius: (state, { payload }: PayloadAction<number>) => {
      state.extraCoverageRadius = payload;
    },
    ...baseReducers,
  },
});
