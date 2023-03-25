import { AxiosResponse } from 'axios';
import qs from 'qs';
import {
  Application,
  ApplicationCredit,
  ApplicationInsurance,
  ApplicationTradeIn,
  Gift,
  PaymentOrder,
} from '@marketplace/ui-kit/types';
import { PaymentOrderDTO } from 'types/dtos/billing.dto';
import API, { APPLICATION_URL } from '../config';
import { AuthHeaders } from '../utils/authHelpers';
import { ApplicationDTO } from '../types/dtos/application.dto';
import {
  ApplicationCreditMapper,
  ApplicationInsuranceMapper,
  ApplicationMapper,
  ApplicationTradeInMapper,
} from './mappers/application.mapper';
import { PaymentOrderMapper } from './mappers/billing.mapper';
import { getVehicleGifts } from './vehicle';

export const getApplication = (uuid: string | number, auth: AuthHeaders): Promise<AxiosResponse<Application>> => {
  return API.get<ApplicationDTO & { vehicle: { gifts: number[] } }>(
    `/applications/${uuid}`,
    {},
    {
      headers: auth,
      baseURL: APPLICATION_URL,
    },
  ).then(async (response) => {
    const {
      data,
      data: { vehicle },
    } = response;
    if (vehicle) {
      const { gifts } = vehicle;
      let enrichedGifts: Gift[] = [];
      if (gifts.length) {
        const giftsResponse = await getVehicleGifts(gifts, auth);
        enrichedGifts = giftsResponse.data;
      }
      return {
        ...response,
        data: ApplicationMapper({}, { ...data, vehicle: { ...vehicle, gifts: enrichedGifts } }),
      };
    }

    return {
      ...response,
      data: ApplicationMapper({}, { ...data }),
    };
  });
};

export const getApplications = (
  filter: Record<string, any>,
  auth: AuthHeaders,
): Promise<AxiosResponse<Application[]>> => {
  return API.get<{ data: ApplicationDTO[] }>('/applications', filter, {
    headers: auth,
    baseURL: APPLICATION_URL,
    paramsSerializer: (params: Record<string, any>) => qs.stringify(params, { encode: false }),
  }).then((response) => {
    return { ...response, data: response.data.data.map((dto) => ApplicationMapper({}, dto)) };
  });
};

export const getSravniUrl = (
  id: string,
  filter: Record<string, any>,
  auth: AuthHeaders,
): Promise<AxiosResponse<Application[]>> => {
  return API.get(`/applications/credit-fis/get-sravni-url/${id}`, filter, {
    headers: auth,
    baseURL: APPLICATION_URL,
    paramsSerializer: (params: Record<string, any>) => qs.stringify(params, { encode: false }),
  }).then((response) => response);
};

export const addApplication = (params: Record<string, any>, auth: AuthHeaders): Promise<AxiosResponse<Application>> => {
  return API.post<ApplicationDTO>(
    '/applications',
    { ...params },
    {
      headers: auth,
      baseURL: APPLICATION_URL,
    },
  ).then((response) => ({ ...response, data: ApplicationMapper({}, response.data) }));
};

export const createApplicationCredit = (
  params: Record<string, any>,
  auth: AuthHeaders,
): Promise<AxiosResponse<void>> => {
  return API.post(
    '/applications/credit',
    { ...params },
    {
      headers: auth,
      baseURL: APPLICATION_URL,
    },
  );
};

export const updateApplicationCredit = (
  id: string | number,
  params: Record<string, any>,
  auth: AuthHeaders,
): Promise<AxiosResponse<void>> => {
  return API.put(
    `/applications/credit/${id}`,
    { ...params },
    {
      headers: auth,
      baseURL: APPLICATION_URL,
    },
  );
};

export const updateApplicationCreditBasic = (
  id: string | number,
  params: Record<string, any>,
  auth: AuthHeaders,
  uuid?: string,
): Promise<AxiosResponse<void>> => {
  return API.put(
    `/applications/credit/basic/${id}${uuid ? `?uuid=${uuid}` : ''}`,
    { ...params },
    {
      headers: auth,
      baseURL: APPLICATION_URL,
    },
  );
};

export const updateApplicationCreditAdditional = (
  id: string | number,
  params: Record<string, any>,
  auth: AuthHeaders,
  uuid?: string,
): Promise<AxiosResponse<void>> => {
  return API.put(
    `/applications/credit/additional/${id}${uuid ? `?uuid=${uuid}` : ''}`,
    { ...params },
    {
      headers: auth,
      baseURL: APPLICATION_URL,
    },
  );
};

export const updateApplicationCreditJob = (
  id: string | number,
  params: Record<string, any>,
  auth: AuthHeaders,
  uuid?: string,
): Promise<AxiosResponse<void>> => {
  return API.put(
    `/applications/credit/job/${id}${uuid ? `?uuid=${uuid}` : ''}`,
    { ...params },
    {
      headers: auth,
      baseURL: APPLICATION_URL,
    },
  );
};

export const updateApplicationCreditSteps = (
  id: string | number,
  params: Record<string, any>,
  auth: AuthHeaders,
  uuid?: string,
): Promise<AxiosResponse<void>> => {
  return API.put(
    `/applications/credit/update-frontend-data/${id}${uuid ? `?uuid=${uuid}` : ''}`,
    { ...params },
    {
      headers: auth,
      baseURL: APPLICATION_URL,
    },
  );
};

export const createApplicationCreditFis = (
  params: Record<string, any>,
  auth: AuthHeaders,
): Promise<AxiosResponse<void>> => {
  return API.post(
    '/applications/credit-fis',
    { ...params },
    {
      headers: auth,
      baseURL: APPLICATION_URL,
    },
  );
};

export const updateApplicationCreditFis = (
  id: string | number,
  params: Record<string, any>,
  auth: AuthHeaders,
  uuid?: string,
): Promise<AxiosResponse<void>> => {
  const url = uuid ? `/applications/credit-fis/${id}?uuid=${uuid}` : `/applications/credit-fis/${id}`;
  return API.put(
    url,
    { ...params },
    {
      headers: auth,
      baseURL: APPLICATION_URL,
    },
  );
};

export const updateApplicationCreditFisBasic = (
  id: string | number,
  params: Record<string, any>,
  auth: AuthHeaders,
): Promise<AxiosResponse<void>> => {
  return API.put(
    `/applications/credit-fis/update-data/basic/${id}`,
    { ...params },
    {
      headers: auth,
      baseURL: APPLICATION_URL,
    },
  );
};

export const updateApplicationCreditFisCalculation = (
  id: string | number,
  params: Record<string, any>,
  auth: AuthHeaders,
): Promise<AxiosResponse<void>> => {
  return API.put(
    `/applications/credit-fis/update-data/calculation/${id}`,
    { ...params },
    {
      headers: auth,
      baseURL: APPLICATION_URL,
    },
  );
};

export const updateApplicationCreditFisDocuments = (
  id: string | number,
  params: Record<string, any>,
  auth: AuthHeaders,
): Promise<AxiosResponse<void>> => {
  return API.put(
    `/applications/credit-fis/update-data/documents/${id}`,
    { ...params },
    {
      headers: auth,
      baseURL: APPLICATION_URL,
    },
  );
};

export const updateApplicationCreditFisAdditional = (
  id: string | number,
  params: Record<string, any>,
  auth: AuthHeaders,
): Promise<AxiosResponse<void>> => {
  return API.put(
    `/applications/credit-fis/update-data/additional/${id}`,
    { ...params },
    {
      headers: auth,
      baseURL: APPLICATION_URL,
    },
  );
};

export const updateApplicationCreditFisJob = (
  id: string | number,
  params: Record<string, any>,
  auth: AuthHeaders,
): Promise<AxiosResponse<void>> => {
  return API.put(
    `/applications/credit-fis/update-data/job/${id}`,
    { ...params },
    {
      headers: auth,
      baseURL: APPLICATION_URL,
    },
  );
};

export const updateApplicationCreditFisIncome = (
  id: string | number,
  params: Record<string, any>,
  auth: AuthHeaders,
): Promise<AxiosResponse<void>> => {
  return API.put(
    `/applications/credit-fis/update-data/income/${id}`,
    { ...params },
    {
      headers: auth,
      baseURL: APPLICATION_URL,
    },
  );
};

export const updateApplicationCreditFisSteps = (
  id: string | number,
  params: Record<string, any>,
  auth: AuthHeaders,
): Promise<AxiosResponse<void>> => {
  return API.put(
    `/applications/credit-fis/update-frontend-data/${id}`,
    { ...params },
    {
      headers: auth,
      baseURL: APPLICATION_URL,
    },
  );
};

export const getLastActiveCredit = (auth: AuthHeaders): Promise<AxiosResponse<Application[]>> => {
  return API.get(
    '/applications/credit-fis/get-last-active',
    {},
    {
      headers: auth,
      baseURL: APPLICATION_URL,
    },
  );
};

export const updateApplicationSimpleCreditSteps = (
  id: string | number,
  uuid: string | number,
  params: Record<string, any>,
  auth: AuthHeaders,
): Promise<AxiosResponse<void>> => {
  return API.put(
    `/applications/simple-credit/update-frontend-data/${id}?uuid=${uuid}`,
    { ...params },
    {
      headers: auth,
      baseURL: APPLICATION_URL,
    },
  );
};

export const createApplicationSimpleCredit = (
  params: Record<string, any>,
  auth: AuthHeaders,
): Promise<AxiosResponse<void>> => {
  return API.post(
    '/applications/simple-credit',
    { ...params },
    {
      headers: auth,
      baseURL: APPLICATION_URL,
    },
  );
};

export const updateApplicationSimpleCreditBasic = (
  id: string | number,
  uuid: string | number,
  params: Record<string, any>,
  auth: AuthHeaders,
): Promise<AxiosResponse<void>> => {
  return API.put(
    `/applications/simple-credit/basic/${id}?uuid=${uuid}`,
    { ...params },
    {
      headers: auth,
      baseURL: APPLICATION_URL,
    },
  );
};

export const updateApplicationSimpleCreditAdditional = (
  id: string | number,
  uuid: string | number,
  params: Record<string, any>,
  auth: AuthHeaders,
): Promise<AxiosResponse<void>> => {
  return API.put(
    `/applications/simple-credit/additional/${id}?uuid=${uuid}`,
    { ...params },
    {
      headers: auth,
      baseURL: APPLICATION_URL,
    },
  );
};

export const updateApplicationSimpleCreditJob = (
  id: string | number,
  uuid: string | number,
  params: Record<string, any>,
  auth: AuthHeaders,
): Promise<AxiosResponse<void>> => {
  return API.put(
    `/applications/simple-credit/job/${id}?uuid=${uuid}`,
    { ...params },
    {
      headers: auth,
      baseURL: APPLICATION_URL,
    },
  );
};

export const bindUser = (auth: AuthHeaders): Promise<AxiosResponse<void>> => {
  return API.put(
    '/applications/credit/link-to-user',
    {},
    {
      headers: auth,
      baseURL: APPLICATION_URL,
    },
  );
};

export const getApplicationInsurancePaymentLinks = (
  id: string | number,
  successUrl: string,
  failUrl: string,
  auth: AuthHeaders,
): Promise<AxiosResponse> => {
  return API.get(
    `/applications/insurance/get-payment-link/${id}`,
    {
      successUrl,
      failUrl,
    },
    {
      headers: auth,
      baseURL: APPLICATION_URL,
    },
  );
};

export const createApplicationInsurance = (
  id: string | number,
  params: Record<string, any>,
  auth: AuthHeaders,
): Promise<AxiosResponse<ApplicationInsurance | null>> => {
  const { type } = params;
  return API.post<ApplicationDTO>(
    '/applications/insurance',
    { ...params },
    {
      headers: auth,
      baseURL: APPLICATION_URL,
    },
  ).then((response) => {
    const currentInsurance = response.data.insurance.find((insurance) => insurance.type === type);
    return {
      ...response,
      data: currentInsurance ? ApplicationInsuranceMapper({}, currentInsurance) : null,
    };
  });
};

export const updateApplicationInsurance = (
  id: string | number,
  params: Record<string, any>,
  auth: AuthHeaders,
): Promise<AxiosResponse<void>> => {
  return API.put(
    `/applications/insurance/${id}`,
    { ...params },
    {
      headers: auth,
      baseURL: APPLICATION_URL,
    },
  );
};

export const calculateApplicationInsurance = (
  id: string | number,
  params: Record<string, any>,
  auth: AuthHeaders,
): Promise<AxiosResponse<any>> => {
  return API.put(
    `/applications/insurance/calculate/${id}`,
    { ...params },
    {
      headers: auth,
      baseURL: APPLICATION_URL,
    },
  );
};

export const importApplicationInsurance = (id: string | number, auth: AuthHeaders): Promise<AxiosResponse<void>> => {
  return API.put(
    `/applications/insurance/import/${id}`,
    {},
    {
      headers: auth,
      baseURL: APPLICATION_URL,
    },
  );
};

export const createApplicationTradeIn = (
  id: string | number,
  params: Record<string, any>,
  auth: AuthHeaders,
): Promise<AxiosResponse<ApplicationTradeIn>> => {
  return API.post(
    '/applications/trade_in',
    { ...params },
    {
      headers: auth,
      baseURL: APPLICATION_URL,
    },
  ).then((response) => {
    return { ...response, data: ApplicationTradeInMapper({}, response.data?.trade_in) };
  });
};

export const updateApplicationTradeIn = (
  id: string | number,
  params: Record<string, any>,
  auth: AuthHeaders,
): Promise<AxiosResponse<ApplicationTradeIn>> => {
  return API.put(
    `/applications/trade_in/${id}`,
    { ...params },
    {
      headers: auth,
      baseURL: APPLICATION_URL,
    },
  ).then((response) => {
    return { ...response, data: ApplicationTradeInMapper({}, response.data) };
  });
};

export const updateApplicationTradeInStatus = (
  id: string | number,
  status: string | number,
  auth: AuthHeaders,
): Promise<AxiosResponse<ApplicationTradeIn>> => {
  return API.put(
    `/applications/trade_in/${id}/status`,
    { status },
    {
      headers: auth,
      baseURL: APPLICATION_URL,
    },
  ).then((response) => ({ ...response, data: ApplicationTradeInMapper({}, response.data) }));
};

export const updateApplicationInsuranceStatus = (
  id: string | number,
  status: string | number,
  auth: AuthHeaders,
): Promise<AxiosResponse<ApplicationInsurance>> => {
  return API.put(
    `/applications/insurance/${id}/status`,
    { status },
    {
      headers: auth,
      baseURL: APPLICATION_URL,
    },
  ).then((response) => {
    return { ...response, data: ApplicationInsuranceMapper({}, response.data) };
  });
};

export const getInsuranceRedirectUrl = (auth: AuthHeaders): Promise<AxiosResponse> => {
  return API.get(
    '/applications/insurance/get-insurance-redirect-url',
    {},
    {
      headers: auth,
      baseURL: APPLICATION_URL,
    },
  );
};

export const updateApplicationCreditStatus = (
  id: string | number,
  status: string | number,
  auth: AuthHeaders,
): Promise<AxiosResponse<ApplicationCredit>> => {
  return API.put(
    `/applications/credit/${id}/status`,
    { status },
    {
      headers: auth,
      baseURL: APPLICATION_URL,
    },
  ).then((response) => ({ ...response, data: ApplicationCreditMapper({}, response.data) }));
};

export const updateApplicationSimpleCreditStatus = (
  id: string | number,
  status: string | number,
  auth: AuthHeaders,
): Promise<AxiosResponse<ApplicationCredit>> => {
  return API.put(
    `/applications/simple-credit/${id}/status`,
    { status },
    {
      headers: auth,
      baseURL: APPLICATION_URL,
    },
  ).then((response) => ({ ...response, data: ApplicationCreditMapper({}, response.data) }));
};

export const updateApplicationVehicleStatus = (
  id: string | number,
  params: Record<string, any>,
  auth: AuthHeaders,
): Promise<AxiosResponse<void>> => {
  return API.put(
    `/applications/vehicle/${id}/status`,
    { ...params },
    {
      headers: auth,
      baseURL: APPLICATION_URL,
    },
  );
};

export const createApplicationBookingOrder = (
  applicationId: string | number,
  params: Record<string, any>,
  auth: AuthHeaders,
): Promise<AxiosResponse<PaymentOrder>> => {
  return API.post<PaymentOrderDTO>(
    `/applications/booking/vehicle/${applicationId}`,
    { ...params },
    {
      headers: auth,
      baseURL: APPLICATION_URL,
    },
  ).then((response) => ({ ...response, data: PaymentOrderMapper({}, response.data) }));
};

export const getApplicationWithBookingStatus = (
  applicationId: string | number,
  auth: AuthHeaders,
): Promise<AxiosResponse<Application>> => {
  return API.get<ApplicationDTO & { vehicle: { gifts: number[] } }>(
    `/applications/booking/status/${applicationId}`,
    {},
    {
      headers: auth,
      baseURL: APPLICATION_URL,
    },
  ).then(async (response) => {
    const {
      data,
      data: {
        vehicle,
        vehicle: { gifts },
      },
    } = response;
    let enrichedGifts: Gift[] = [];
    if (gifts.length) {
      const giftsResponse = await getVehicleGifts(gifts, auth);
      enrichedGifts = giftsResponse.data;
    }

    return {
      ...response,
      data: ApplicationMapper({}, { ...data, vehicle: { ...vehicle, gifts: enrichedGifts } }),
    };
  });
};

export const scheduleMeeting = (
  auth: AuthHeaders,
  id: string,
  { applicationType, dateTime }: Record<string, any>,
): Promise<AxiosResponse<void>> => {
  return API.post(
    '/meeting/schedule',
    {
      application_id: id,
      application_type: applicationType,
      date_time: dateTime,
    },
    {
      headers: auth,
      baseURL: APPLICATION_URL,
    },
  );
};

export const updateMeeting = (
  auth: AuthHeaders,
  id: string,
  { applicationType, dateTime }: Record<string, any>,
): Promise<AxiosResponse<void>> => {
  return API.put(
    '/meeting/schedule',
    {
      application_id: id,
      application_type: applicationType,
      date_time: dateTime,
    },
    {
      headers: auth,
      baseURL: APPLICATION_URL,
    },
  );
};

export const createApplicationInstalment = (
  params: Record<string, any>,
  auth: AuthHeaders,
): Promise<AxiosResponse<void>> => {
  return API.post(
    '/applications/vehicle/installment',
    { ...params },
    {
      headers: auth,
      baseURL: APPLICATION_URL,
    },
  );
};

export const updateApplicationInstalment = (
  id: string | number,
  params: Record<string, any>,
  auth: AuthHeaders,
): Promise<AxiosResponse<void>> => {
  return API.put(
    `/applications/vehicle/installment/${id}`,
    { ...params },
    {
      headers: auth,
      baseURL: APPLICATION_URL,
    },
  );
};

export const updateInstalmentStatus = (
  id: string | number,
  params: Record<string, any>,
  auth: AuthHeaders,
): Promise<AxiosResponse<void>> => {
  return API.put(
    `/applications/vehicle/installment/${id}/status`,
    { status: params },
    {
      headers: auth,
      baseURL: APPLICATION_URL,
    },
  );
};

export const createApplicationDeposit = ({
  phone,
  name,
  source,
  deposit: { amount, term, userId, refill, withdrawal, withoutPercentWithdrawal },
  meta,
}: Record<string, any>): Promise<AxiosResponse<void>> => {
  // TODO убрать переопределение имен полей из бфф, вынести, если это необходимо на уровень МКП
  const data: Record<string, any> = {
    name,
    phone,
    source,
    deposit: {
      sum: amount,
      term,
      capitalization: withoutPercentWithdrawal,
      replenishment: refill,
      partial_removal: withdrawal,
    },
  };

  if (userId) {
    data.userId = userId;
  }

  if (meta) {
    const { utmSource, utmContent, utmMedium, utmCampaign, utmTerm, clientId, timestamp } = meta;
    data.utm = {
      source: utmSource,
      medium: utmMedium,
      campaign: utmCampaign,
      term: utmTerm,
      content: utmContent,
      client_id: clientId,
      timestamp,
    };
  }

  return API.post('/applications/deposit', data, {
    baseURL: APPLICATION_URL,
  });
};

export const createC2cApplication = (auth: AuthHeaders, params: Record<string, any>): Promise<AxiosResponse<void>> => {
  return API.post('/applications/vehicle/c2c', params, {
    headers: auth,
    baseURL: APPLICATION_URL,
  });
};

export const createApplicationDebit = (params: Record<string, any>): Promise<AxiosResponse<void>> => {
  return API.post('/applications/card-debit', params, {
    baseURL: APPLICATION_URL,
  });
};

export const scheduleVehicleMeeting = (
  auth: AuthHeaders,
  id: string,
  params: Record<string, any>,
): Promise<AxiosResponse<void>> => {
  return API.post(`/applications/vehicle/${id}/meeting/schedule/user`, params, {
    headers: auth,
    baseURL: APPLICATION_URL,
  });
};

export const scheduleVehicleInstallmentMeeting = (
  auth: AuthHeaders,
  id: string,
  params: Record<string, any>,
): Promise<AxiosResponse<void>> => {
  return API.post(`/applications/vehicle/installment/${id}/meeting/schedule/user`, params, {
    headers: auth,
    baseURL: APPLICATION_URL,
  });
};

export const getApprovedCreditExists = (auth: AuthHeaders): Promise<AxiosResponse<{ exists: boolean }>> => {
  return API.get(
    '/applications/credit/approved-credit-exists',
    {},
    {
      headers: auth,
      baseURL: APPLICATION_URL,
    },
  );
};

export const createSavingsAccount = ({ phone, name, utm }: Record<string, any>): Promise<AxiosResponse<void>> => {
  const data: Record<string, any> = {
    name,
    phone,
  };

  if (utm) {
    const { utmSource, utmContent, utmMedium, utmCampaign, utmTerm, clientId, timestamp } = utm;
    data.utm = {
      source: utmSource,
      medium: utmMedium,
      campaign: utmCampaign,
      term: utmTerm,
      content: utmContent,
      client_id: clientId,
      timestamp,
    };
  }

  return API.post('/applications/savings-account', data, {
    baseURL: APPLICATION_URL,
  });
};

export const payForOrder = (auth: AuthHeaders, applicationId: string): Promise<AxiosResponse<any>> => {
  return API.post(
    `/applications/booking/vehicle/${applicationId}`,
    {},
    {
      headers: auth,
      baseURL: APPLICATION_URL,
    },
  );
};

export const syncOrderPayment = (auth: AuthHeaders, vehicleId: string): Promise<AxiosResponse<any>> => {
  return API.get(
    `/applications/booking/status-by-vehicle/${vehicleId}`,
    {},
    {
      headers: auth,
      baseURL: APPLICATION_URL,
    },
  );
};

export const bookWithPayment = (auth: AuthHeaders, vehicleId: string): Promise<AxiosResponse<any>> => {
  return API.put(
    `/applications/vehicle/${vehicleId}/book-with-payment`,
    {},
    {
      headers: auth,
      baseURL: APPLICATION_URL,
    },
  );
};

export const bookWithoutPayment = (auth: AuthHeaders, vehicleId: string): Promise<AxiosResponse<any>> => {
  return API.put(
    `/applications/vehicle/${vehicleId}/book-without-payment`,
    {},
    {
      headers: auth,
      baseURL: APPLICATION_URL,
    },
  );
};

export const cancelHolding = (auth: AuthHeaders, vehicleId: string): Promise<AxiosResponse<any>> => {
  return API.post(
    `/applications/booking/hold-cancel/${vehicleId}`,
    {},
    {
      headers: auth,
      baseURL: APPLICATION_URL,
    },
  );
};
