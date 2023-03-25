import { PaymentOrder } from '@marketplace/ui-kit/types/Billing';
import { AxiosResponse } from 'axios';
import { PaymentOrderDTO } from 'types/dtos/billing.dto';
import API, { BILLING_URL } from '../config';
import { AuthHeaders } from '../utils/authHelpers';
import { PaymentOrderMapper } from './mappers/billing.mapper';

export const getOrderHoldUrl = (auth: AuthHeaders): Promise<AxiosResponse<{ data: string }>> => {
  return API.get<{ data: string }>('/hold-url', {}, { baseURL: BILLING_URL, headers: auth });
};

export const getOrderHoldSignature = (
  id: string | number,
  auth: AuthHeaders,
): Promise<AxiosResponse<{ data: string }>> => {
  return API.get<{ data: string }>(`/hold-signature/${id}`, {}, { baseURL: BILLING_URL, headers: auth }).then(
    (response) => ({ ...response }),
  );
};

export const getOrderStatus = (id: string | number, auth: AuthHeaders): Promise<AxiosResponse<PaymentOrder>> => {
  return API.get<PaymentOrderDTO>(`/order/${id}`, {}, { baseURL: BILLING_URL, headers: auth }).then((response) => ({
    ...response,
    data: PaymentOrderMapper({}, response.data),
  }));
};

export const createOrder = (params: Record<string, any>, auth: AuthHeaders): Promise<AxiosResponse<PaymentOrder>> => {
  return API.post<PaymentOrderDTO>(
    '/order',
    { ...params },
    {
      headers: auth,
      baseURL: BILLING_URL,
      params,
    },
  ).then((response) => ({ ...response, data: PaymentOrderMapper({}, response.data) }));
};

export const debitOrderFunds = (
  id: string | number,
  params: Record<string, any>,
  auth: AuthHeaders,
): Promise<AxiosResponse<PaymentOrder>> => {
  return API.post<PaymentOrderDTO>(
    `/capture/${id}`,
    { ...params },
    {
      headers: auth,
      baseURL: BILLING_URL,
    },
  ).then((response) => ({ ...response, data: PaymentOrderMapper({}, response.data) }));
};

export const refundOrderFunds = (
  id: string | number,
  params: Record<string, any>,
  auth: AuthHeaders,
): Promise<AxiosResponse<PaymentOrder>> => {
  return API.post<PaymentOrderDTO>(
    `/refund/${id}`,
    { ...params },
    {
      headers: auth,
      baseURL: BILLING_URL,
    },
  ).then((response) => ({ ...response, data: PaymentOrderMapper({}, response.data) }));
};

export const transferOrderFundsToDealer = (
  id: string | number,
  params: Record<string, any>,
  auth: AuthHeaders,
): Promise<AxiosResponse<PaymentOrder>> => {
  return API.post<PaymentOrderDTO>(
    `/dealer-payment/${id}`,
    { ...params },
    {
      headers: auth,
      baseURL: BILLING_URL,
    },
  ).then((response) => ({ ...response, data: PaymentOrderMapper({}, response.data) }));
};
