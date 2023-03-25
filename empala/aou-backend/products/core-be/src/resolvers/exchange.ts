import {
  Resolver, Query, Arg, Mutation, UseMiddleware, Authorized, Ctx,
} from 'type-graphql';
import { Exchange } from '../models/exchange';
import { Exchanges, ExchangesResult } from '../results/exchanges';
import { CreateExchangeResult, CreateExchangeSuccess } from '../results/create-exchange';
import { CreateErrorHandler } from '../utils/middlewares/error-handler';
import { EAccessRole } from '../security/auth-checker';
import { CreateExchangeAlreadyExistsError } from '../errors/create-exchange-already-exists';
import { CreateExchangeInput } from '../inputs/create-exchange';

@Resolver(Exchange)
export class ExchangeResolver {
  @Query(() => ExchangesResult)
  public async exchanges(
    @Arg('name', () => String, { nullable: true }) exchangeName?: string,
  ): Promise<typeof ExchangesResult> {
    const result = new Exchanges();
    result.exchanges = exchangeName ? await Exchange.find({ where: { name: exchangeName } }) : await Exchange.find();
    return result;
  }

  @Authorized([EAccessRole.MARKETDATA_UPDATER])
  @Mutation(() => CreateExchangeResult)
  @UseMiddleware(CreateErrorHandler)
  public async createExchange(
    @Ctx() ctx: any,
      @Arg('input', () => CreateExchangeInput, { nullable: false }) input: CreateExchangeInput,
  ): Promise<typeof CreateExchangeResult> {
    const { name, country } = input;
    const existingExchanges = await Exchange.find({ where: { name } });
    if (existingExchanges.length > 0) {
      return new CreateExchangeAlreadyExistsError(`Exchange with name '${name}' already exists`, ctx.requestId);
    }
    const exchange = new Exchange();
    exchange.name = name;
    exchange.country = country;
    await exchange.save();
    const result = new CreateExchangeSuccess();
    result.exchange = exchange;
    return result;
  }
}
