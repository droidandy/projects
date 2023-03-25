/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable class-methods-use-this */
/* eslint-disable arrow-parens */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Arg, Authorized, Ctx, FieldResolver, ID, Int, Mutation, Query, Resolver, Root,
} from 'type-graphql';
import { getManager, getRepository, In } from 'typeorm';
import { ResolveTree } from 'graphql-parse-resolve-info';
import { Instrument } from '../models/instrument';
import { ECountry } from '../enums/country';
import { InstNotFoundError } from '../errors/inst-not-found';
import { OneRandomInstrumentResult } from '../results/random-instrument';
import { Instruments, InstrumentsResult } from '../results/instrument';
import { ViewStockPricesLast } from '../models/view-stock-prices-last';
import { Fields } from '../utils/graphql/common';
import { Theme } from '../models/theme';
import { Stack } from '../models/stack';
import { Hunch } from '../models/hunch';
import { CreateInstrumentInput } from '../inputs/create-instrument';
import { EFeed, InstrumentFeed } from '../models/instrument-feed';
import { Exchange } from '../models/exchange';
import { CreateInstrumentResult, CreateInstrumentSuccess } from '../results/create-instrument';
import { EAccessRole } from '../security/auth-checker';
import { RefreshPricesViewSuccess } from '../results/refresh-prices-view';
import { logger } from '../../../utils/src/logger';
import { InstrumentLogosResult } from '../results/instrument-logos';
import { InstrumentNameChangeInput } from '../inputs/instrument-name-change';
import { InstrumentLogos } from '../models/instrument-logos';

const instrumentPatternArgDescription = `Search pattern.  Pass % for returning all instruments up to nMax.
The argument uses SQL LIKE logic for searching, for more info visit: https://www.postgresql.org/docs/14/functions-matching.html#FUNCTIONS-LIKE`;

const getInstrumentRelations = (fieldsToReturn: any): string[] => {
  const relations = [];
  if ('themes' in fieldsToReturn && !('nMax' in fieldsToReturn.themes.args)) {
    relations.push('themes');
  }
  if ('feeds' in fieldsToReturn) {
    relations.push('instrumentFeeds');
  }
  if ('exchange' in fieldsToReturn) {
    relations.push('exchange');
  }
  return relations;
};

@Resolver(of => Instrument)
export class InstrumentResolver {
  public static async getYesterdayClosePrice(instId: BigInt): Promise<number | null> {
    const result = await getRepository(ViewStockPricesLast).findOne({ where: { instId } });
    return result ? result.priceClose : null;
  }

  public static async getYesterdayClosePriceDate(instId: BigInt): Promise<Date | null> {
    const result = await getRepository(ViewStockPricesLast).findOne({ where: { instId } });
    return result ? result.priceDate : null;
  }

  public static async getYesterdayClosePriceFeed(instId: BigInt): Promise<EFeed | null> {
    const result = await getRepository(ViewStockPricesLast).findOne({ where: { instId } });
    return result ? result.priceFeed : null;
  }

  @Authorized([EAccessRole.MARKETDATA_UPDATER])
  @Query(() => InstrumentsResult)
  public async instrumentsInfo(
    @Fields() fields: ResolveTree,
      @Arg('symbols', () => [String], { nullable: true, defaultValue: null }) symbols: [string],
      @Arg('feed', () => EFeed, { nullable: true, defaultValue: null }) feed: EFeed,
  ): Promise<typeof InstrumentsResult> {
    const result = new Instruments();
    result.instruments = [];

    const queryBuilder = getRepository(Instrument).createQueryBuilder('inst');
    const conditions = [];
    if (symbols && symbols.length) {
      conditions.push(`inst.symbol IN (${symbols.map((s) => `'${s}'`).join(',')})`);
    }
    if (feed) {
      conditions.push(`inst.id in (select inst_id from instruments.inst_feed where feed = '${feed}')`);
    }
    if (conditions.length) {
      queryBuilder.where(conditions.map((v) => `( ${v} )`).join(' AND '));
    }
    result.instruments = await queryBuilder.addOrderBy('inst.symbol')
      .skip(0)
      .getMany();
    return result;
  }

  @Query(() => InstrumentsResult, { description: 'NO AUTH - AOU-351 -> AOU-75' })
  public async instruments(
    @Ctx() ctx: any,
      @Fields() fields: ResolveTree,
      @Arg('pattern', { description: instrumentPatternArgDescription }) pattern: string,
      @Arg('onlyTraded', { nullable: true, defaultValue: true }) onlyTraded: boolean,
      @Arg('nMax', () => Int, { nullable: true }) nMax: number,
  ): Promise<typeof InstrumentsResult> {
    // The restriction has been temporarily lifted in order to receive a complete list of instruments.
    // In particular, it is used to get the latest dates for which there is a price in morningstar-datagrabber
    //
    // const N_MAX_INST_REQUESTED = 20;
    // if (nMax > N_MAX_INST_REQUESTED)  {
    //   return new TooManyItemsRequestedError(`No more than ${N_MAX_INST_REQUESTED} instruments can be requested`, ctx.requestId);
    // }
    const result = new Instruments();

    result.instruments = [];
    if (!pattern || pattern.length === 0) return result;
    pattern = pattern.toUpperCase();

    let queryBuilder = getRepository(Instrument).createQueryBuilder('inst')
      .addSelect(`CASE WHEN symbol = '${pattern}' THEN true ELSE false END`, 'is_match')
      .where(`((inst.symbol LIKE '${pattern}%') or (inst.description LIKE '%${pattern}%'))`);
    if (onlyTraded) {
      queryBuilder.andWhere('inst.id in (select inst_id from launchpad.inst_scalar_props where is_traded = true)');
    }
    queryBuilder.orderBy('is_match', 'DESC')
      .addOrderBy('inst.symbol')
      .skip(0);
    if (nMax) {
      queryBuilder = queryBuilder.limit(nMax);
    }
    const inst = await queryBuilder.getRawAndEntities();
    result.instruments = inst.entities;
    for (let indInst = 0; indInst < inst.raw.length; indInst++) {
      result.instruments[indInst].isLookupExactMatch = inst.raw[indInst].is_match;
    }
    return result;
  }

  @Query(() => OneRandomInstrumentResult, { description: 'NO AUTH - AOU-519 -> AOU-82' })
  public async oneRandomInst(
    @Ctx() ctx: any,
      @Fields() fields: ResolveTree,
      @Arg('instIds', () => [ID]) instIds: [BigInt],
  ): Promise<typeof OneRandomInstrumentResult> {
    const randomId = instIds[Math.floor(Math.random() * instIds.length)];
    const relations = getInstrumentRelations(fields.fieldsByTypeName.Instrument);
    const foundInstrument = await Instrument.findOne({ where: { id: randomId }, relations });
    if (foundInstrument) {
      return foundInstrument;
    }
    return new InstNotFoundError(`Instrument with ID ${randomId} does not exist in the system`, ctx.requestId);
  }

  @FieldResolver()
  public async themes(
    @Fields() fields: ResolveTree,
      @Root() instrument: Instrument,
      @Arg('nMax', () => Int, { nullable: true }) nMax?: number,
  ): Promise<Theme[]> {
    if (instrument.themes) {
      return instrument.themes;
    }
    const relations = [];
    if ('instruments' in fields.fieldsByTypeName.Theme
      && !('nMax' in fields.fieldsByTypeName.Theme.instruments.args)) relations.push('instruments');
    const themeIdsRaw = await getManager().createQueryBuilder()
      .select('theme_id')
      .from('theme_inst', 'theme_inst')
      .where('theme_inst.inst_id = :instId', { instId: instrument.id })
      .skip(0)
      .limit(nMax)
      .getRawMany();
    return getRepository(Theme).find({
      where: { id: In(Array.from(themeIdsRaw.map((elem) => String(elem.theme_id)))) },
      relations,
    });
  }

  @FieldResolver()
  public async stacks(
    @Root() instrument: Instrument,
      @Arg('nMax', () => Int, { nullable: true }) nMax?: number,
  ): Promise<Stack[]> {
    const stackIds = getManager().createQueryBuilder()
      .select('stack_id')
      .from('stack_inst', 'stack_inst')
      .where('stack_inst.inst_id = :instId');
    return getRepository(Stack).createQueryBuilder('stack')
      .where('stack.user_id = :userId', { userId: instrument.userId })
      .andWhere(`stack.id IN (${stackIds.getQuery()})`, { instId: instrument.id })
      .skip(0)
      .limit(nMax)
      .getMany();
  }

  @FieldResolver()
  public async hunches(
    @Fields() fields: ResolveTree,
      @Root() instrument: Instrument,
      @Arg('nMax', () => Int, { nullable: true }) nMax?: number,
  ): Promise<Hunch[]> {
    const relations = [];
    if ('instrument' in fields.fieldsByTypeName.Hunch) relations.push('instrument');
    return getRepository(Hunch).find({
      where: { instId: instrument.id, userId: instrument.userId },
      skip: 0,
      take: nMax,
      relations,
    });
  }

  @FieldResolver()
  public async currentPrice(@Root() instrument: Instrument): Promise<number | null> {
    // Will return closing price for now instead of currentPrice
    return InstrumentResolver.getYesterdayClosePrice(instrument.id);
  }

  @FieldResolver()
  public async currentPriceDate(@Root() instrument: Instrument): Promise<Date | null> {
    return InstrumentResolver.getYesterdayClosePriceDate(instrument.id);
  }

  @FieldResolver()
  public async currentPriceFeed(@Root() instrument: Instrument): Promise<EFeed | null> {
    return InstrumentResolver.getYesterdayClosePriceFeed(instrument.id);
  }

  @FieldResolver()
  public async yesterdayClosePrice(@Root() instrument: Instrument): Promise<number | null> {
    return InstrumentResolver.getYesterdayClosePrice(instrument.id);
  }

  @FieldResolver()
  public async yesterdayClosePriceDate(@Root() instrument: Instrument): Promise<Date | null> {
    return InstrumentResolver.getYesterdayClosePriceDate(instrument.id);
  }

  @FieldResolver()
  public async yesterdayClosePriceFeed(@Root() instrument: Instrument): Promise<EFeed | null> {
    return InstrumentResolver.getYesterdayClosePriceFeed(instrument.id);
  }

  @FieldResolver()
  public async askCurrentPrice(@Root() instrument: Instrument): Promise<number | null> {
    const price = Number(await InstrumentResolver.getYesterdayClosePrice(instrument.id));
    return price ? Number((price + price * 0.05 * Math.random()).toFixed(2)) : null; // add up to 5% randomly for ask price
  }

  @FieldResolver()
  public async bidCurrentPrice(@Root() instrument: Instrument): Promise<number | null> {
    const price = Number(await InstrumentResolver.getYesterdayClosePrice(instrument.id));
    return price ? Number((price - price * 0.05 * Math.random()).toFixed(2)) : null; // subtract up to 5% randomly for bid price
  }

  @FieldResolver()
  public async exchange(
    @Fields() fields: ResolveTree,
      @Root() instrument: Instrument,
  ): Promise<Exchange> {
    if (instrument.exchange) {
      return instrument.exchange;
    }
    return getRepository(Exchange).findOne({ where: { id: instrument.exchangeId } });
  }

  @FieldResolver()
  public async country(@Root() instrument: Instrument): Promise<ECountry> {
    if (instrument.exchange) {
      return instrument.exchange.country;
    }
    const exchange = await getRepository(Exchange).findOne({
      where: { id: instrument.exchangeId },
      select: ['country'],
    });
    return exchange.country;
  }

  @FieldResolver()
  public async name(
    @Root() instrument: Instrument,
  ): Promise<string> {
    return instrument.shortDescription.replace(/\b(?:trust|ltd|llc|corp|inc)\b/gi, '').replace(/\s\s+/g, ' ').trim();
  }

  @FieldResolver()
  public async feeds(
    @Root() instrument: Instrument,
  ): Promise<EFeed[]> {
    if (instrument.feeds) {
      return instrument.feeds;
    }
    if (instrument.instrumentFeeds) {
      return instrument.instrumentFeeds.map((instrumentFeed) => instrumentFeed.feed);
    }
    const instrumentFeeds = await getRepository(InstrumentFeed).find({
      where: { instId: instrument.id },
      select: ['feed'],
    });
    return instrumentFeeds.map((instrumentFeed) => instrumentFeed.feed);
  }

  @FieldResolver()
  public async logos(
    @Fields() fields: ResolveTree,
      @Root() instrument: Instrument,
      @Ctx() ctx: any,
  ): Promise<typeof InstrumentLogosResult> {
    const fetchAbsentLogos = async () => {
      const result = await getRepository(InstrumentLogos)
        .findOne({
          where: { instId: instrument.id },
          relations: ('instrument' in fields.fieldsByTypeName.InstrumentLogos) ? ['instrument'] : [],
          cache: true,
        });

      return result ?? new InstNotFoundError(`Logos for ${instrument.symbol} not found`, ctx.requestId);
    };

    return instrument.logos ?? fetchAbsentLogos();
  }

  @Authorized([EAccessRole.MARKETDATA_UPDATER])
  @Mutation(() => CreateInstrumentResult)
  public async createInstruments(
    @Ctx() ctx: any,
      @Fields() fields: ResolveTree,
      @Arg('instruments', () => [CreateInstrumentInput], { nullable: false }) instruments: CreateInstrumentInput[],
      @Arg('feed', () => EFeed, { nullable: false }) feed: EFeed,
      @Arg('nameChanges', () => [InstrumentNameChangeInput], { nullable: true }) nameChanges: InstrumentNameChangeInput[],
  ): Promise<typeof CreateInstrumentResult> {
    try {
      const exchangeMap = new Map();
      (await getRepository(Exchange).find()).forEach(({ name, id }) => exchangeMap.set(name, id));

      // Preparing symbol renaming map (helper to speed up the next operation)
      // and an array with renaming data, to be passed to the sql function
      const instrumentsNameChangeArray: [oldSymbol: string, newSymbol: string, exchangeName: string, country: string][] = [];
      const nameChangeCache: { [exchangeName: string]: { [oldSymbol: string]: string } } = {};
      nameChanges?.forEach(({ oldSymbol, newSymbol, exchangeName }) => {
        if (!nameChangeCache[exchangeName]) {
          nameChangeCache[exchangeName] = {};
        }
        nameChangeCache[exchangeName][oldSymbol] = newSymbol;
        const country = 'USA'; // TODO get country by Exchange
        instrumentsNameChangeArray.push([oldSymbol, newSymbol, exchangeName, country]);
      });
      /*
       Preparing 2-dimensional array of instruments data to upsert. The order of the elements is important.
       In the request, we send the already renamed instruments, since if rename map is passed, the sql function
       will first update the symbols names in the instruments.inst table and then upsert passed instruments data.
       */
      const instrumentsArray = instruments.map((x: CreateInstrumentInput) => [
        x.country || ECountry.USA,
        x.cusip || null,
        x.description || x.shortDescription || null,
        x.exchangeName || null,
        x.sedol || null,
        x.shortDescription || null,
        nameChangeCache[x.exchangeName]?.[x.symbol] ?? x.symbol,
        x.type || null,
      ]);

      // Data type returned by the sql function that upsert instruments.
      interface InstUpsertResultRecord {
        index_of_input_array: number; // 0-based index of instrument in instrumentsArray
        inst_id: BigInt; // ID of the instrument that was upserted. 0 - if the instrument is not upserted.
        error_message: string; // Reason (error) message for which the instrument could not be upserted.
        country: string;
        cusip: string;
        exchange_name: string;
        symbol: string;
        is_inserted: boolean; // Flag that the record has been added to the database (otherwise - updated)
      }

      const upsertResult: InstUpsertResultRecord[] = [];
      const CHUNK_SIZE = 900;
      await getManager().transaction(async transactionalEntityManager => {
        while (instrumentsArray.length) {
          const chunk = instrumentsArray.splice(0, CHUNK_SIZE);
          const chunkUpsertResult: InstUpsertResultRecord[] = await getManager().query(
            'SELECT * FROM instruments.upsert_instruments_and_update_symbols($1,$2,$3);',
            [chunk, instrumentsNameChangeArray, feed],
          );
          upsertResult.push(...chunkUpsertResult);
        }
      });
      const instrumentIds: BigInt[] = upsertResult.filter(({ error_message: e }: any) => !e).map(({ inst_id: id }: any) => id as BigInt);
      const instrumentsWithErrors = upsertResult.filter(({ error_message: e }: any) => e);
      instrumentsWithErrors.forEach((eRow: InstUpsertResultRecord) => {
        logger.error(`Error while upsert instrument symbol: ${eRow.symbol} / cusip: ${eRow.cusip}  / country: ${
          eRow.country} / exchange: ${eRow.exchange_name}\n ${eRow.error_message}`);
      });
      const insertedCount = upsertResult.filter(({ is_inserted: i, error_message: e }: any) => i && !e).length;
      const updatedCount = upsertResult.filter(({ is_inserted: i, error_message: e }: any) => !i && !e).length;
      await getManager().query('CALL launchpad.update_inst_scalar_props_is_traded()');
      logger.info(`Upserted ${instrumentIds.length
      } instruments (inserted: ${insertedCount}, updated: ${updatedCount}, errors: ${instrumentsWithErrors.length} )`);

      const fieldsToReturn = fields.fieldsByTypeName.CreateInstrumentSuccess.instruments.fieldsByTypeName.Instrument;
      const relations = getInstrumentRelations(fieldsToReturn);
      const result = new CreateInstrumentSuccess();
      result.instruments = await getRepository(Instrument).find({ where: { id: In(instrumentIds) }, relations });
      if ('feeds' in fieldsToReturn) {
        result.instruments.forEach((inst) => {
          inst.feeds = inst.instrumentFeeds.map(({ feed: f }) => f);
          delete inst.instrumentFeeds;
        });
      }
      if ('description' in fieldsToReturn) {
        result.instruments.forEach(inst => {
          /* istanbul ignore next */
          if (!inst.description) {
            inst.description = inst.shortDescription;
          }
        });
      }
      return result;
    } catch (error: Error | any) /* istanbul ignore next */ {
      if (error.detail) {
        error.message = `${error.message}. ${error.detail}`;
      }
      throw error;
    }
  }

  @Authorized([EAccessRole.MARKETDATA_UPDATER])
  @Mutation(() => RefreshPricesViewSuccess)
  public async refreshPricesMaterializedView() {
    const result = new RefreshPricesViewSuccess();
    result.success = true;
    await getManager().query('REFRESH MATERIALIZED VIEW marketdata.view_stock_prices_last;');
    return result;
  }
}
