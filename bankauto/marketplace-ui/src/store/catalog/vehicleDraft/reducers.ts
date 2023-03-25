import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VehicleOfferDraft } from 'api/client/vehicle';
import { initialState } from 'store/initial-state';

export const { reducer, actions } = createSlice({
  name: 'vehicleDraftData',
  initialState: initialState.vehicleDraftData,
  reducers: {
    setDraftData: (
      state,
      {
        payload,
      }: PayloadAction<{
        draftData: VehicleOfferDraft;
      }>,
    ) => ({
      ...state,
      ...payload,
      loading: false,
      initial: false,
    }),
    setSentStatus: (state, { payload }: PayloadAction<boolean>) => ({
      ...state,
      isSent: payload,
    }),
    setInitialItem: () => ({
      ...initialState.vehicleDraftData,
    }),
  },
});
