import { APPLICATION_INSURANCE_TYPE, APPLICATION_INSURANCE_STATUS } from '@marketplace/ui-kit/types';
import { AsyncAction } from 'types/AsyncAction';
import { ApplicationInsuranceCalculationData, InsuranceApplication, InsuranceCalculation } from 'types/Insurance';

export const REQUEST_INSURANCE_APPLICATION = 'REQUEST_INSURANCE_APPLICATION';
export const RECEIVE_INSURANCE_APPLICATION = 'RECEIVE_INSURANCE_APPLICATION';
export const ERROR_INSURANCE_APPLICATION = 'ERROR_INSURANCE_APPLICATION';
export const REQUEST_INSURANCE_SERVICE = 'REQUEST_INSURANCE_SERVICE';
export const RECEIVE_INSURANCE_SERVICE = 'RECEIVE_INSURANCE_SERVICE';
export const ERROR_INSURANCE_SERVICE = 'ERROR_INSURANCE_SERVICE';
export const REQUEST_INSURANCE_PAYMENT_LINK = 'REQUEST_INSURANCE_PAYMENT_LINK';
export const RECEIVE_INSURANCE_PAYMENT_LINK = 'RECEIVE_INSURANCE_PAYMENT_LINK';

export type RequestInsuranceApplication = {
  type: typeof REQUEST_INSURANCE_APPLICATION;
};

export type ReceiveInsuranceApplication = {
  type: typeof RECEIVE_INSURANCE_APPLICATION;
  payload: InsuranceApplication;
};

export type ErrorInsuranceApplication = {
  type: typeof ERROR_INSURANCE_APPLICATION;
  payload: Error;
};

export type RequestInsuranceService = {
  type: typeof REQUEST_INSURANCE_SERVICE;
  payload: APPLICATION_INSURANCE_TYPE;
};

export type ReceiveInsuranceService = {
  type: typeof RECEIVE_INSURANCE_SERVICE;
  payload: APPLICATION_INSURANCE_TYPE;
};

export type ErrorInsuranceService = {
  type: typeof ERROR_INSURANCE_SERVICE;
  payload: { type: APPLICATION_INSURANCE_TYPE; error: Error };
};

export type RequestInsurancePaymentLink = {
  type: typeof REQUEST_INSURANCE_PAYMENT_LINK;
  payload: APPLICATION_INSURANCE_TYPE;
};

export type ReceiveInsurancePaymentLink = {
  type: typeof RECEIVE_INSURANCE_PAYMENT_LINK;
  payload: { link: string; type: APPLICATION_INSURANCE_TYPE };
};

// export type InsuranceApplicationStoreActions =
//   | RequestInsuranceApplication
//   | ReceiveInsuranceApplication
//   | ErrorInsuranceApplication
//   | RequestInsuranceService
//   | ReceiveInsuranceService
//   | ErrorInsuranceService
//   | RequestInsurancePaymentLink
//   | ReceiveInsurancePaymentLink;

export type CalculateInsuranceResult = InsuranceCalculation & { type: APPLICATION_INSURANCE_TYPE };
export type ImportInsuranceResult = { id: string | number; type: APPLICATION_INSURANCE_TYPE; imported: boolean };

export interface InsuranceApplicationActions {
  requestInsuranceApplication(): RequestInsuranceApplication;
  receiveInsuranceApplication(application: InsuranceApplication): ReceiveInsuranceApplication;
  errorInsuranceApplication(error: Error): ErrorInsuranceApplication;
  requestInsuranceService(type: APPLICATION_INSURANCE_TYPE): RequestInsuranceService;
  receiveInsuranceService(type: APPLICATION_INSURANCE_TYPE): ReceiveInsuranceService;
  errorInsuranceService(type: APPLICATION_INSURANCE_TYPE, error: Error): ErrorInsuranceService;
  requestInsurancePaymentLink(type: APPLICATION_INSURANCE_TYPE): RequestInsurancePaymentLink;
  receiveInsurancePaymentLink(link: string, type: APPLICATION_INSURANCE_TYPE): ReceiveInsurancePaymentLink;
  fetchInsuranceApplication(uuid?: string): AsyncAction<Promise<InsuranceApplication>>;
  createInsuranceApplication(): AsyncAction<Promise<InsuranceApplication>>;
  calculateInsuranceService(
    type: APPLICATION_INSURANCE_TYPE,
    id: string | number,
    values: ApplicationInsuranceCalculationData,
  ): AsyncAction<Promise<CalculateInsuranceResult>>;
  calculateInsuranceApplication(
    values: ApplicationInsuranceCalculationData,
  ): AsyncAction<Promise<CalculateInsuranceResult[]>>;
  importInsuranceService(
    type: APPLICATION_INSURANCE_TYPE,
    id: string | number,
  ): AsyncAction<Promise<ImportInsuranceResult>>;
  importInsuranceApplication(): AsyncAction<Promise<ImportInsuranceResult[]>>;
  saveInsuranceApplication(values: ApplicationInsuranceCalculationData): AsyncAction;
  fetchApplicationPaymentLinks(id: number, type: APPLICATION_INSURANCE_TYPE): AsyncAction;
  setInsuranceServiceStatus(type: APPLICATION_INSURANCE_TYPE, status: APPLICATION_INSURANCE_STATUS): AsyncAction;
  insuranceApplicationReseted(): AsyncAction;
}
