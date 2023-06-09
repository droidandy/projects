import {
  Application,
  ApplicationC2c,
  ApplicationCredit,
  ApplicationInstalment,
  ApplicationInsurance,
  ApplicationSimpleCredit,
  ApplicationTradeIn,
  ApplicationVehicle,
} from '@marketplace/ui-kit/types/Application';
import {
  APPLICATION_CREDIT_STATUS,
  APPLICATION_INSTALMENT_STATUS,
  APPLICATION_INSURANCE_STATUS,
  APPLICATION_INSURANCE_TYPE,
  APPLICATION_TRADE_IN_STATUS,
  APPLICATION_TYPE,
  APPLICATION_VEHICLE_STATUS,
  SPECIAL_OFFER_ALIAS,
  VEHICLE_TYPE,
  VEHICLE_TYPE_ID,
} from '@marketplace/ui-kit/types/Enum';

export const ApplicationVehicleMock: ApplicationVehicle = {
  id: 267,
  applicationId: 267,
  bookedTill: undefined,
  meetingSchedule: undefined,
  paymentDate: undefined,
  vehicleId: 1979,
  salesOfficeId: 894,
  price: 1132739,
  status: APPLICATION_VEHICLE_STATUS.NEW,
  discount: 36427,
  type: VEHICLE_TYPE.NEW,
  isPaid: false,
  number: '1',
  gifts: [{ name: 'Коврики', id: 1 }],
  specialOffer: {
    id: 124,
    percent: 6.5,
    name: 'Специальное предложение',
    link: 'https://bankauto.ru/',
    alias: SPECIAL_OFFER_ALIAS.KIA,
    vehicleType: VEHICLE_TYPE_ID.NEW,
    applicationType: APPLICATION_TYPE.VEHICLE,
    dealerDiscount: 0,
  },
};
export const ApplicationCreditMock: ApplicationCredit = {
  id: 26,
  applicationId: 267,
  vehicleId: 1979,
  initialPayment: 819431,
  amount: 276881,
  term: 30,
  monthlyPayment: 9229,
  passport_uuid: undefined,
  status: APPLICATION_CREDIT_STATUS.NEW,
  discount: 12524,
  number: '1',
  lastSentStep: 2,
  type: 1,
  rate: 0,
  subtype: 1,
};
export const ApplicationSimpleCreditMock: ApplicationSimpleCredit = {
  id: 26,
  applicationId: 267,
  initialPayment: 819431,
  amount: 276881,
  term: 30,
  monthlyPayment: 9229,
  passport_uuid: undefined,
  status: APPLICATION_CREDIT_STATUS.NEW,
  discount: 12524,
  number: '1',
  lastSentStep: 2,
  type: 1,
  subtype: 1,
  rate: 0.059,
  vehicleCost: 1_000_000,
};
export const ApplicationInstalmentMock: ApplicationInstalment = {
  id: 28,
  vehicleId: 267,
  initialPayment: 0,
  payment: 24564,
  months: 48,
  status: APPLICATION_INSTALMENT_STATUS.BOOKED,
  vehiclePrice: 1000000,
  typesOfInstallment: [
    {
      initialPayment: 0,
      payment: 24564,
      months: 48,
    },
  ],
};
export const ApplicationC2cMock: ApplicationC2c = {
  id: 28,
  vehicleId: 267,
  price: 700000,
  seller: {
    firstName: 'First',
    lastName: 'Name',
    patronymic: '',
    phone: '+79998882233',
  },
};
export const ApplicationTradeInMock: ApplicationTradeIn = {
  id: 265,
  applicationId: 267,
  vehicleId: 1979,
  status: APPLICATION_TRADE_IN_STATUS.NEW,
  discount: 23494,
  number: '1',
};
export const ApplicationInsuranceMock: ApplicationInsurance = {
  id: 266,
  applicationId: 267,
  type: APPLICATION_INSURANCE_TYPE.CASCO,
  driverLicenseUuid: undefined,
  driversNumber: undefined,
  status: APPLICATION_INSURANCE_STATUS.NEW,
  discount: 409,
  number: '1',
};

export const ApplicationMock: Application = {
  id: 267,
  uuid: '543c3457-f675-41e9-9d02-a0cfae2f4395',
  customerUuid: 'f22177fd-5bcf-463b-bfbd-aa2aef5ab894',
  employeeUuid: undefined,
  createdAt: 1599810209,
  updatedAt: 1599810209,
  discount: undefined,
  vehicle: ApplicationVehicleMock,
  credit: ApplicationCreditMock,
  instalment: ApplicationInstalmentMock,
  c2c: ApplicationC2cMock,
  tradeIn: ApplicationTradeInMock,
  insurance: [ApplicationInsuranceMock],
};
