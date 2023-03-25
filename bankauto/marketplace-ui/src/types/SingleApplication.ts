import { VEHICLE_TYPE_ID } from '@marketplace/ui-kit/types';

export interface SingleApplication {
  vehicle?: SingleApplicationVehicle;
  insurance?: { type: string }[] | null;
  trade_in?: { discount: number | null } | null;
  credit?: SingleApplicationCredit | null;
  vehicle_installment?: SingleApplicationInstalment;
  withCredit?: boolean;
  withTradeIn?: boolean;
}

export interface SingleApplicationCredit {
  initial_payment: string | number;
  amount: string | number;
  term: string | number;
  discount: string | number;
}

export interface SingleApplicationSpecialOffer {
  id: number;
  percent: number;
  name: string;
  link?: string;
  vehicle_type?: VEHICLE_TYPE_ID;
  alias?: string;
  application_type: string | null;
  dealer_discount: number | null;
}

export interface SingleApplicationVehicle {
  price: number;
  booking_price: number;
  vehicle_id: string | number;
  type: string;
  sales_office_id: number | null;
  discount: number;
  gifts: number[];
  special_offer: SingleApplicationSpecialOffer | null;
}

export interface SingleApplicationInstalment {
  vehicle_id: number;
  initial_payment: number;
  payment: number;
  months: number;
  amount: number;
  vehicle_price: number;
  application_uuid?: string;
  initial_payment_percent?: number | null;
  special_offer: SingleApplicationSpecialOffer | null;
}
