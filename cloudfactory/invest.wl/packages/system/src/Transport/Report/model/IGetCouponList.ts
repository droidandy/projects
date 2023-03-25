import { IDCurrencyDTO } from '@invest.wl/core';

export interface IGetCouponListRequest {
  instrumentId: number;
  offset?: number;
  pageSize?: number;
}

export interface IGetCouponListResponse extends Array<IGetCouponListResponseItem> {
}

export interface IGetCouponListResponseItem {
  Rate: number;
  Amount: number;
  Currency: IDCurrencyDTO;
  PaymentDate: Date;
  DeliveryDate: Date;
  PeriodName: string;
  Amortization: Amortization;
}

interface Amortization {
  Amount: number;
  Percent: number;
}
