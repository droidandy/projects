import { AxiosResponse } from 'axios';
import API, { DIR_URL } from '../config';
import { AuthHeaders } from '../utils/authHelpers';
export const createApplicationExpress = (
  name: string,
  phone: string,
  needTradeIn: string,
  needCredit: string,
  vehicleId: number,
  vehicleColor: string,
): Promise<AxiosResponse> =>
  API.post(
    '/v1/lead/express',
    {
      name,
      phone,
      need_trade_in: needTradeIn ? 1 : 0,
      need_credit: needCredit ? 1 : 0,
      vehicle_id: vehicleId,
      color: vehicleColor,
    },
    {
      baseURL: DIR_URL,
    },
  );
export const createApplicationTestDrive = (vehicleId: number, auth: AuthHeaders): Promise<AxiosResponse> =>
  API.post(
    '/v1/lead/test-drive',
    {
      vehicleId,
    },
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  );

export const createApplicationSubscription = (vehicleId: number, auth: AuthHeaders): Promise<AxiosResponse> =>
  API.post(
    '/v1/lead/subscription',
    {
      vehicleId,
    },
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  );
