import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BaseStateProperties, VehicleState } from 'store/types';
import { initialState } from 'store/initial-state';
import { baseReducers } from 'store/utils/baseReducers';
import { APPLICATION_VEHICLE_STATUS } from '@marketplace/ui-kit/types';

export const { reducer, actions } = createSlice({
  name: 'applicationVehicle',
  initialState: initialState.application.vehicle,
  reducers: {
    ...baseReducers,
    setApplication: (state, { payload }: PayloadAction<VehicleState>) => ({
      ...state,
      ...payload,
    }),
    setApplicationState: (state, { payload }: PayloadAction<BaseStateProperties & VehicleState>) => ({
      ...payload,
    }),
    setApplicationVehicleStatus: (state, { payload }: PayloadAction<APPLICATION_VEHICLE_STATUS>) => ({
      ...state,
      status: payload,
    }),
    setApplicationDesiredMeetingData: (state, { payload }: PayloadAction<number>) => ({
      ...state,
      meetingSchedule: {
        dateTime: null,
        desiredDateTime: payload,
      },
    }),
    setPdfUrl: (state, { payload }: PayloadAction<string>) => ({
      ...state,
      pdf: payload,
    }),
    setQrCodeUrl: (state, { payload }: PayloadAction<string>) => ({
      ...state,
      qrCode: payload,
    }),
    setApplicationRefund: (state, { payload }: PayloadAction<number>) => {
      return {
        ...state,
        // Почему-то бэк просто сносит эти поля и делает вид, что так и должно быть...
        status: APPLICATION_VEHICLE_STATUS.PAYMENT,
        paymentDate: undefined,
        refundDate: undefined,
      };
    },
  },
});
