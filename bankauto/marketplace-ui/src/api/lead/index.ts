import API, { CancellableAxiosPromise } from 'api/request';

type ApplicationExpressParams = {
  phone: string;
  name: string;
  needTradeIn: boolean;
  needCredit: boolean;
  vehicleId: number;
  vehicleColor: string;
};

export const createApplicationExpress = (params: ApplicationExpressParams): CancellableAxiosPromise => {
  return API.post('/lead/express', params, { authRequired: false });
};

export const createApplicationTestDrive = (vehicleId: number): CancellableAxiosPromise => {
  return API.post('/lead/test-drive', { vehicleId }, { authRequired: true });
};

export const createApplicationSubscription = (vehicleId: number): CancellableAxiosPromise => {
  return API.post('/lead/subscription', { vehicleId }, { authRequired: true });
};
