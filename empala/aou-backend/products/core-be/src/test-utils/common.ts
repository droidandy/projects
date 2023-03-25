import { ExecutionResult } from 'graphql';
import { getRepository } from 'typeorm';
import { ViewStockPricesLast } from '../models/view-stock-prices-last';
import { EAccessRole } from '../security/auth-checker';

export const launchpadUserMetadata = {
  role: EAccessRole.LAUNCHPAD_USER,
  user: {
    id: 1,
    fullName: 'Jason Bull',
    userName: 'jbull',
  },
  token: {
    username: 'jbull',
    email: 'jason.bull@coolmail.com',
  },
};

export const checkForbiddenError = (result: ExecutionResult): void => {
  expect(result.errors).toBeDefined();
  expect(result.errors[0].extensions.code).toEqual('FORBIDDEN');
};

export const getPriceForInstId = async (id: string) => {
  const priceFromDb = await getRepository(ViewStockPricesLast).findOne({
    where: {
      instId: id,
    },
  });
  return priceFromDb.priceClose.toString();
};
