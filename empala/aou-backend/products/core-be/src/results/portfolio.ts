import { createUnionType } from 'type-graphql';
import { OrderError } from '../errors/order-error';
import { TPSPDataFetchError } from '../errors/tpsp-data-fetch-error';
import { PortfolioEntries } from '../models/portfolio';

export const PortfolioEntriesResult = createUnionType({
  name: 'PortfolioEntriesResult',
  types: () => [PortfolioEntries, OrderError, TPSPDataFetchError],
});
