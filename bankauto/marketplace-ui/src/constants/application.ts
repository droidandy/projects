import {
  APPLICATION_CREDIT_STATUS,
  APPLICATION_VEHICLE_STATUS,
  SPECIAL_OFFER_ALIAS,
  VEHICLE_STATUS,
} from '@marketplace/ui-kit/types';
import { CREDIT_PROGRAM_NAME } from './credit';

export interface ApplicationVehicleStatusStep {
  isBooked: boolean;
  isMeeting: boolean;
  isBeingDelivered: boolean;
  isPaid: boolean;
  isCanceled: boolean;
}

export const getApplicationVehicleStatusStep = (status?: APPLICATION_VEHICLE_STATUS): ApplicationVehicleStatusStep => {
  const isCanceled: boolean = status === APPLICATION_VEHICLE_STATUS.CANCEL;
  const isBeingDelivered: boolean =
    status === APPLICATION_VEHICLE_STATUS.DELIVERY || status === APPLICATION_VEHICLE_STATUS.SUCCESS;
  const isFrozen = status === APPLICATION_VEHICLE_STATUS.FROZEN;
  const isMeeting: boolean = status === APPLICATION_VEHICLE_STATUS.MEETING || isFrozen || isBeingDelivered;
  const isBooked: boolean = status === APPLICATION_VEHICLE_STATUS.BOOKED || isMeeting;
  const isPaid: boolean = status === APPLICATION_VEHICLE_STATUS.NEW || isBooked;
  return {
    isBooked,
    isMeeting,
    isBeingDelivered,
    isPaid,
    isCanceled,
  };
};
export const approvalStatuses = [
  APPLICATION_VEHICLE_STATUS.SUCCESS,
  APPLICATION_VEHICLE_STATUS.FROZEN,
  APPLICATION_VEHICLE_STATUS.MEETING,
  APPLICATION_VEHICLE_STATUS.DELIVERY,
  APPLICATION_CREDIT_STATUS.APPROVED,
];

export const deactivatedStatusesForApplications = [
  VEHICLE_STATUS.DEALER_DEACTIVATED,
  VEHICLE_STATUS.CLIENT_DEACTIVATED,
  VEHICLE_STATUS.SOLD,
  VEHICLE_STATUS.DECLINED,
];

export const SPECIAL_CREDIT_PROGRAM_MAP: Record<string, CREDIT_PROGRAM_NAME> = {
  [SPECIAL_OFFER_ALIAS.GEELY]: CREDIT_PROGRAM_NAME.GEELY,
  [SPECIAL_OFFER_ALIAS.GEELY_INSTALMENT]: CREDIT_PROGRAM_NAME.GEELY,
  [SPECIAL_OFFER_ALIAS.KIA]: CREDIT_PROGRAM_NAME.KIA,
  [SPECIAL_OFFER_ALIAS.HYUNDAI]: CREDIT_PROGRAM_NAME.HYUNDAI,
  [SPECIAL_OFFER_ALIAS.CAPTIVE]: CREDIT_PROGRAM_NAME.CAPTIVE,
};
