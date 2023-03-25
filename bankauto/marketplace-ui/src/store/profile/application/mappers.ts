import { Application } from '@marketplace/ui-kit/types';
import { initialState } from 'store/initial-state';
import { CreditStep } from 'containers/PersonalArea/Application/types';

const getContainerApplicationMappedData = (data: Application) => ({
  id: data.id,
  uuid: data.uuid,
  discount: data.discount ?? 0,
  createdAt: data.createdAt,
});

const getVehicleApplicationMappedData = (data: Application) => {
  const { vehicle, instalment, vehicleData } = data;

  return {
    id: vehicle?.id,
    vehicleId: vehicle?.vehicleId,
    discount: vehicle?.discount,
    number: vehicle?.number,
    type: vehicle?.type,
    salesOfficeId: vehicle?.salesOfficeId,
    price: vehicle?.price ?? instalment?.payment ?? 0,
    isPaid: vehicle?.isPaid,
    paymentDate: vehicle?.paymentDate,
    refundDate: vehicle?.refundDate,
    bookedTill: vehicle?.bookedTill,
    meetingSchedule: vehicle?.meetingSchedule,
    data: vehicleData,
    status: vehicle?.status,
    specialOffer: vehicle?.specialOffer,
  };
};

export const getSimpleCreditApplicationMappedData = (data: Application) => {
  let savedData;
  try {
    savedData = JSON.parse(data.simpleCredit?.savedData ?? '');
  } catch (e) {
    savedData = null;
  }
  return {
    id: data.simpleCredit?.id,
    discount: data.simpleCredit?.discount,
    initialPayment: data.simpleCredit?.initialPayment ?? initialState.application.simpleCredit.initialPayment,
    amount: data.simpleCredit?.amount ? data.simpleCredit.amount : initialState.application.simpleCredit.amount,
    term: data.simpleCredit?.term ?? initialState.application.simpleCredit.term,
    monthlyPayment: data.simpleCredit?.monthlyPayment ?? initialState.application.simpleCredit.monthlyPayment,
    status: data.simpleCredit?.status ?? initialState.application.simpleCredit.status,
    savedStep: data.simpleCredit?.savedStep,
    savedData,
    number: data.simpleCredit?.number,
    creditStep: CreditStep.Calculation,
    rate: data.simpleCredit?.rate ?? initialState.application.simpleCredit.rate,
    type: data.simpleCredit?.type ?? initialState.application.simpleCredit.type,
    vehicleCost: data.simpleCredit?.vehicleCost ?? initialState.application.simpleCredit.vehicleCost,
    subtype: data.simpleCredit?.subtype ?? initialState.application.simpleCredit.subtype,
  };
};

export { getContainerApplicationMappedData, getVehicleApplicationMappedData };
