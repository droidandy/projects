/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
import { ApolloError } from 'apollo-server';
import {
  Ctx, FieldResolver, Resolver, Root,
} from 'type-graphql';
import { logger } from '../../../utils/src/logger';
import { OrderError } from '../errors/order-error';
import { TPSPDataFetchError } from '../errors/tpsp-data-fetch-error';
import { Instrument } from '../models/instrument';
import { Portfolio, PortfolioEntries, PortfolioEntry } from '../models/portfolio';
import { PortfolioEntriesResult } from '../results/portfolio';
import { ApexTokenManager } from '../utils/apex-token-manager';
import { TradeAccountResolver } from './trade-account';

@Resolver(Portfolio)
export class PortfolioResolver {
  @FieldResolver()
  public async portfolioEntries(@Ctx() ctx: any, @Root() portfolio: Portfolio): Promise<typeof PortfolioEntriesResult> {
    const accountId = await TradeAccountResolver.getTradeAccountId(ctx.metadata.user.id);
    try {
      const result = await ApexTokenManager.sendTradeApiAxiosRequest('get', `/api/user/portfolio?loadQuotes=true&account=${accountId}`);
      const retVal = new PortfolioEntries();
      retVal.entries = result.data.map((e: any) => PortfolioEntry.createFromData(e));
      return retVal;
    } catch (error) {
      if (error instanceof ApolloError && error.extensions.isConnectionError) {
        return new TPSPDataFetchError('Error connecting to execution server', ctx.requestId);
      }

      const msg = 'Error retrieving portfolio entries';
      logger.error(msg, error);
      const orderError = new OrderError(msg, ctx.requestId);
      return orderError;
    }
  }
}

@Resolver(PortfolioEntry)
export class PortfolioEntryResolver {
  @FieldResolver()
  public async instrument(@Root() entry: PortfolioEntry) {
    const inst = await Instrument.findOne({ where: { symbol: entry.symbol } });

    /* istanbul ignore else */
    if (inst) return inst;

    const msg = `Unknown symbol for PortfolioEntry: ${entry.symbol}`;
    logger.error(msg);
    throw new Error(msg);
  }
}
