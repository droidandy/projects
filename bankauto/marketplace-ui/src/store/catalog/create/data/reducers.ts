import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { baseReducers } from 'store/utils/baseReducers';
import { initialState } from 'store/initial-state';
import { VehicleFormDataParams, VehicleFormData, VehicleFormCatalogType } from 'types/VehicleFormType';

export const { reducer, actions } = createSlice({
  name: 'vehicleCreateData',
  initialState: initialState.vehicleCreateData,
  reducers: {
    setData: (
      state,
      {
        payload: { data, params, catalogType, initial },
      }: PayloadAction<{
        data: VehicleFormData;
        params?: VehicleFormDataParams;
        catalogType?: VehicleFormCatalogType;
        initial?: boolean | null;
      }>,
    ) => ({
      ...state,
      data,
      params: { ...state.params, ...params },
      catalogType: catalogType || state.catalogType,
      loading: false,
      initial: typeof initial === 'undefined' ? false : initial,
    }),
    setDraftData: (
      state,
      {
        payload: { draftData },
      }: PayloadAction<{
        draftData: any;
      }>,
    ) => ({
      ...state,
      draftData,
    }),
    setId: (
      state,
      {
        payload: { id, initial },
      }: PayloadAction<{
        id?: number;
        initial?: boolean | null;
      }>,
    ) => ({
      ...state,
      params: {
        ...state.params,
        id: id || state.params.id,
      },
      loading: false,
      initial: typeof initial === 'undefined' ? false : initial,
    }),
    ...baseReducers,
  },
});
