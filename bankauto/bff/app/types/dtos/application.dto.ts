import { CreditSubtype, CreditType, SimpleCreditSubtype } from '@marketplace/ui-kit/types';
import { VehicleGiftsDTO } from './vehicle.dto';

export interface ApplicationSubDTO {
  id: number;
  application_id: number;
  discount: number;
  status: string;
  number: string;
}

export interface ApplicationMeetingDTO {
  date_time: number | null;
  desired_date_time: number | null;
}

export interface ApplicationVehicleDTO extends ApplicationSubDTO, VehicleGiftsDTO {
  vehicle_id: number;
  sales_office_id: number;
  price: number;
  type: string;
  is_paid: boolean;
  payment_date: number | null;
  refund_date: number | null;
  booked_till: number | null;
  meeting_schedule: ApplicationMeetingDTO | null;
  special_offer: VehicleSpecialOfferDTO;
}

export interface ApplicationCreditCommonDTO extends ApplicationSubDTO {
  initial_payment: number;
  amount: number;
  term: number;
  monthly_payment: number;
  passport_uuid: string | null;
  request_last_step?: number;
  frontend_step?: number;
  frontend_data?: string;
  rate: number;
  type: CreditType;
}

export interface ApplicationCreditDTO extends ApplicationCreditCommonDTO {
  vehicle_id: number;
  vehicle_cost?: number;
  subtype: CreditSubtype;
}

export interface ApplicationSimpleCreditDTO extends ApplicationCreditCommonDTO {
  vehicle_cost: number;
  subtype: SimpleCreditSubtype;
}

export interface ApplicationInstalmentDTO extends Pick<ApplicationSubDTO, 'id' | 'status'> {
  vehicle_id: number;
  initial_payment: number;
  payment: number;
  months: number;
  vehicle_price: number;
  types_of_installment: {
    applications_vehicle_installment_id: number;
    created_at: number;
    id: number;
    initial_payment: number;
    initial_payment_percent?: number;
    payment: number;
    months: number;
  }[];
  meeting_schedule: ApplicationMeetingDTO | null;
  special_offer?: SpecialOfferDTO;
}

export interface ApplicationC2cDTO extends Pick<ApplicationSubDTO, 'id'> {
  application_id: number;
  vehicle_id: number;
  price: number;
  seller: {
    first_name: string;
    last_name: string;
    patronymic_name: string;
    phone: string;
  };
  created_at: number;
  updated_at: number;
}

export interface ApplicationTradeInDTO extends ApplicationSubDTO {
  vehicle_id: number | null;
}

export interface ApplicationInsuranceDTO extends ApplicationSubDTO {
  type: string;
  driver_license_uuid: string | null;
  drivers_number: number | null;
  price?: number;
  data?: any;
}

export interface ApplicationDTO {
  id: number;
  uuid: string;
  owner_uuid: string;
  manager_uuid: string | null;
  created_at: number;
  updated_at: number;
  discount: number | null;
  vehicle: ApplicationVehicleDTO;
  credit: ApplicationCreditDTO | ApplicationSimpleCreditDTO;
  vehicle_installment: ApplicationInstalmentDTO;
  trade_in: ApplicationTradeInDTO;
  vehicle_c2c: ApplicationC2cDTO;
  insurance: ApplicationInsuranceDTO[];
}

export interface VehicleSpecialOfferDTO {
  id: number;
  percent: number;
  name: string;
  alias: string;
  link: string;
  vehicleType: number | null;
  applicationType?: string | null;
  dealerDiscount: number;
  installmentTerm?: number | null;
  installmentInitialPaymentPercent?: number | null;
}

export interface SpecialOfferDTO {
  id: number;
  percent: number | null;
  name: string | null;
  alias: string | null;
  link: string | null;
  vehicle_type: number | null;
  application_type: string;
  dealer_discount: number | null;
}
