import {
  Application,
  ApplicationC2c,
  ApplicationCredit,
  ApplicationInstalment,
  ApplicationInsurance,
  ApplicationMeeting,
  ApplicationSimpleCredit,
  ApplicationSub,
  ApplicationTradeIn,
  ApplicationVehicle,
} from '@marketplace/ui-kit/types/Application';
import { VehicleGifts } from '@marketplace/ui-kit/types/Vehicle';
import {
  APPLICATION_CREDIT_STATUS,
  APPLICATION_INSTALMENT_STATUS,
  APPLICATION_INSURANCE_STATUS,
  APPLICATION_INSURANCE_TYPE,
  APPLICATION_TRADE_IN_STATUS,
  APPLICATION_TYPE,
  APPLICATION_VEHICLE_STATUS,
  VEHICLE_TYPE,
  VEHICLE_TYPE_ID,
} from '@marketplace/ui-kit/types/Enum';
import { CreditSubtype, CreditType, SpecialOffer } from '@marketplace/ui-kit/types';
import {
  ApplicationC2cDTO,
  ApplicationCreditDTO,
  ApplicationDTO,
  ApplicationInstalmentDTO,
  ApplicationInsuranceDTO,
  ApplicationMeetingDTO,
  ApplicationSimpleCreditDTO,
  ApplicationSubDTO,
  ApplicationTradeInDTO,
  ApplicationVehicleDTO,
  SpecialOfferDTO,
} from '../../types/dtos/application.dto';
import { pipeMapper } from './utils';
import { VehicleGiftsMapper } from './vehicle.mapper';

export const ApplicationSubMapper = <T>(item: T, dto: ApplicationSubDTO): T & ApplicationSub => ({
  ...item,
  id: dto.id,
  applicationId: dto.application_id,
  discount: dto.discount,
  number: dto.number,
});

export const MeetingMapper = <T>(item: T, dto: ApplicationMeetingDTO): T & ApplicationMeeting => {
  return {
    ...item,
    dateTime: dto.date_time,
    desiredDateTime: dto.desired_date_time,
  };
};

export const SpecialOfferMapper = (dto: SpecialOfferDTO): SpecialOffer => {
  return {
    id: dto.id,
    percent: dto.percent ?? 0,
    name: dto.name ?? '',
    alias: dto.alias ?? '',
    link: dto.link ?? '',
    vehicleType: dto.vehicle_type ?? VEHICLE_TYPE_ID.NEW,
    applicationType: dto.application_type as APPLICATION_TYPE,
    dealerDiscount: dto.dealer_discount ?? 0,
  };
};

export const ApplicationVehicleMapper = pipeMapper(
  ApplicationSubMapper,
  VehicleGiftsMapper,
  <T extends ApplicationSub & VehicleGifts>(item: T, dto: ApplicationVehicleDTO): T & ApplicationVehicle => ({
    ...item,
    vehicleId: dto.vehicle_id,
    type: dto.type as VEHICLE_TYPE,
    salesOfficeId: dto.sales_office_id,
    price: dto.price,
    status: dto.status as APPLICATION_VEHICLE_STATUS,
    isPaid: dto.is_paid,
    paymentDate: dto.payment_date || undefined,
    refundDate: dto.refund_date || undefined,
    bookedTill: dto.booked_till || undefined,
    meetingSchedule: dto.meeting_schedule ? MeetingMapper({}, dto.meeting_schedule) : undefined,
    specialOffer: dto.special_offer as SpecialOffer,
  }),
);

export const ApplicationCreditMapper = pipeMapper(
  ApplicationSubMapper,
  <T extends ApplicationSub>(item: T, dto: ApplicationCreditDTO): T & ApplicationCredit => ({
    ...item,
    vehicleId: dto.vehicle_id,
    initialPayment: dto.initial_payment,
    amount: dto.amount,
    term: dto.term,
    monthlyPayment: dto.monthly_payment,
    passport_uuid: dto.passport_uuid || undefined,
    status: dto.status as APPLICATION_CREDIT_STATUS,
    lastSentStep: dto.request_last_step,
    savedStep: dto.frontend_step,
    savedData: dto.frontend_data,
    type: dto.type,
    subtype: dto.subtype,
    rate: dto.rate,
  }),
);

export const ApplicationSimpleCreditMapper = pipeMapper(
  ApplicationSubMapper,
  <T extends ApplicationSub>(item: T, dto: ApplicationSimpleCreditDTO): T & ApplicationSimpleCredit => ({
    ...item,
    initialPayment: dto.initial_payment,
    amount: dto.amount,
    term: dto.term,
    monthlyPayment: dto.monthly_payment,
    passport_uuid: dto.passport_uuid || undefined,
    status: dto.status as APPLICATION_CREDIT_STATUS,
    lastSentStep: dto.request_last_step,
    savedStep: dto.frontend_step,
    savedData: dto.frontend_data,
    rate: dto.rate,
    type: dto.type,
    subtype: dto.subtype,
    vehicleCost: dto.vehicle_cost,
  }),
);

export const ApplicationInstalmentMapper = pipeMapper(
  <T>(item: T, dto: ApplicationInstalmentDTO): T & ApplicationInstalment => ({
    ...item,
    id: dto.id,
    vehicleId: dto.vehicle_id,
    initialPayment: dto.initial_payment,
    payment: dto.payment,
    months: dto.months,
    status: dto.status as APPLICATION_INSTALMENT_STATUS,
    vehiclePrice: dto.vehicle_price ?? 0,
    typesOfInstallment: dto.types_of_installment.map((data) => ({
      initialPayment: data.initial_payment,
      initialPaymentPercent: data.initial_payment_percent ?? undefined,
      months: data.months,
      payment: data.payment,
    })),
    meetingSchedule: dto.meeting_schedule ? MeetingMapper({}, dto.meeting_schedule) : undefined,
    specialOffer: dto.special_offer ? SpecialOfferMapper(dto.special_offer) : undefined,
  }),
);

export const ApplicationC2cMapper = pipeMapper(<T>(item: T, dto: ApplicationC2cDTO): T & ApplicationC2c => ({
  ...item,
  id: dto.id,
  price: dto.price,
  vehicleId: dto.vehicle_id,
  seller: dto.seller
    ? {
        firstName: dto.seller.first_name,
        phone: dto.seller.phone,
        lastName: dto.seller.last_name ?? '',
        patronymic: dto.seller.patronymic_name ?? '',
      }
    : undefined,
}));

export const ApplicationTradeInMapper = pipeMapper(
  ApplicationSubMapper,
  <T extends ApplicationSub>(item: T, dto: ApplicationTradeInDTO): T & ApplicationTradeIn => ({
    ...item,
    vehicleId: dto.vehicle_id,
    status: dto.status as APPLICATION_TRADE_IN_STATUS,
  }),
);

export const ApplicationInsuranceMapper = pipeMapper(
  ApplicationSubMapper,
  <T extends ApplicationSub>(item: T, dto: ApplicationInsuranceDTO): T & ApplicationInsurance => ({
    ...item,
    type: dto.type as APPLICATION_INSURANCE_TYPE,
    driverLicenseUuid: dto.driver_license_uuid || undefined,
    driversNumber: dto.drivers_number || undefined,
    status: dto.status as APPLICATION_INSURANCE_STATUS,
    price: dto.price,
  }),
);

export const ApplicationMapper = <T>(item: T, dto: ApplicationDTO): T & Application => {
  return {
    ...item,
    id: dto.id,
    uuid: dto.uuid,
    customerUuid: dto.owner_uuid,
    employeeUuid: dto.manager_uuid || undefined,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
    discount: dto.discount || undefined,
    vehicle: dto.vehicle ? ApplicationVehicleMapper({}, dto.vehicle) : undefined,
    insurance: dto.insurance.map((i) => ApplicationInsuranceMapper({}, i)),
    credit:
      dto.credit?.type === CreditType.VEHICLE || dto.credit?.type === CreditType.FIS
        ? ApplicationCreditMapper({}, dto.credit as ApplicationCreditDTO)
        : undefined,
    simpleCredit:
      dto.credit?.type === CreditType.SIMPLE ||
      (dto.credit?.type === CreditType.VEHICLE && dto.credit?.subtype === CreditSubtype.BDA_C2C)
        ? ApplicationSimpleCreditMapper({}, dto.credit as ApplicationSimpleCreditDTO)
        : undefined,
    instalment: dto.vehicle_installment ? ApplicationInstalmentMapper({}, dto.vehicle_installment) : undefined,
    c2c: dto.vehicle_c2c ? ApplicationC2cMapper({}, dto.vehicle_c2c) : undefined,
    tradeIn: dto.trade_in ? ApplicationTradeInMapper({}, dto.trade_in) : undefined,
  };
};
