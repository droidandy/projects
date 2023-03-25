import { GraphQLClient } from 'graphql-request';
import { logger } from './lib/logger';
import { CreateInstrumentInput, EFeed, InstrumentNameChangeInput } from './types/gql-types';
import { getCoreAccessToken } from './lib/token';

let coreClient: GraphQLClient;
export const queryCore = async (gql: string, values: any = null): Promise<any> => {
  if (!coreClient) {
    const endpoint = process.env.APOLLO_SERVER_HOST_URI || 'http://localhost:3000';
    coreClient = new GraphQLClient(endpoint);
  }
  const token = await getCoreAccessToken();
  coreClient.setHeader('authorization', `Bearer ${token}`);
  return values ? coreClient.request(gql, values) : coreClient.request(gql);
};

let hasuraClient: GraphQLClient;
export const queryHasura = async (gql: string, values: any = null): Promise<any> => {
  if (!hasuraClient) {
    const hasuraEndpoint = process.env.HASURA_GRAPHQL_ENDPOINT || 'http://localhost:8080/v1/graphql';
    hasuraClient = new GraphQLClient(hasuraEndpoint);
  }
  hasuraClient.setHeader('X-Hasura-Admin-Secret', process.env.HASURA_GRAPHQL_ADMIN_SECRET);
  return values ? hasuraClient.request(gql, values) : hasuraClient.request(gql);
};

export const getLastPriceDates = async (instrumentIDs: string[], feed: EFeed): Promise<any[]> => {
  const query = `
    query Instruments {
      instruments(pattern: "%", onlyTraded: false) {
        ... on Instruments {
          instruments {
            lastPriceDate: yesterdayClosePriceDate
            id
            symbol
            feed: yesterdayClosePriceFeed
          }
        }
      }
    }
  `;
  const { instruments: { instruments } } = await queryCore(query);
  return instrumentIDs.map((id: string) => {
    const { lastPriceDate = null } = instruments.find(({ id: i, feed: f }: any) => f === feed && i === id) || {};
    return { id, lastPriceDate };
  });
};

export const getPresenceOfDalyPricesForInstrument = async (instId: string, fromDateISO: string): Promise<any[]> => {
  const query = `
    query Query {
      rows: marketdata_view_stock_prices_daily(where: {inst_id: {_eq: "${instId}"}, ts_date: {_gt: "${fromDateISO}"}}) {
        ts: ts_date
      }
    }
  `;
  const { rows } = await queryHasura(query);
  return rows.map(({ ts }: any) => ts);
};

/**
 * Returns the full list of instruments available in the DB in the form of a <symbol> -> { <id>, <last price date> }
 *
 * Used:
 * 1) To identify new instruments: it is compared with the list obtained from MS and the difference is sought
 * 2) To form a complete list of instruments for which we need to load daily bars from the MC
 */
export const getInstrumentsListFromDb = async (): Promise<Record<string, any>[]> => {
  const feed = EFeed.MORNING_STAR;
  const query = `query mq($feed: EFeed) {
      inst: instrumentsInfo(feed: $feed) {
        ... on Instruments {
          instruments {
            id
            symbol
            type
            exchange {
              name
            }
          }
        }
      }
    }`;
  const { inst: { instruments } } = await queryCore(query, { feed });

  const lastPrices = await getLastPriceDates(instruments.map(({ id }: any) => id), feed);

  const instrumentsMap: Record<string, any> = {};
  instruments.forEach((row: any) => {
    const {
      id, symbol, type, exchange: { name: exchangeName },
    } = row;
    instrumentsMap[id] = {
      id, symbol, type, exchangeName, lastPriceDate: null,
    };
  });
  lastPrices.forEach(({ id, lastPriceDate }) => {
    if (instrumentsMap[id]) {
      instrumentsMap[id].lastPriceDate = lastPriceDate;
    }
  });
  return Object.values(instrumentsMap);
};

export const saveMissingInstruments = async (
  instruments: CreateInstrumentInput[],
  feed: EFeed,
  nameChanges: InstrumentNameChangeInput[],
): Promise<ShortInstrumentData[]> => {
  const startTime = Date.now();
  const query = `
    mutation saveMissingInstruments(
      $feed: EFeed!
      , $instruments: [CreateInstrumentInput!]!
      , $nameChanges: [InstrumentNameChangeInput!]
    ) {
      createInstruments(
        feed: $feed
        , instruments: $instruments
        , nameChanges: $nameChanges
      ) {
        ... on CreateInstrumentSuccess {
          instruments{
            id
            symbol
            exchange{
              name
            }
            type
          }
        }
      }
    }
    `;
  const response = await queryCore(query, { feed, instruments, nameChanges });
  logger.info(`Successfully saved data for ${instruments.length} instruments in [${Date.now() - startTime} ms]`);
  return response.createInstruments.instruments;
};

export const saveDailyBars = async (
  stockPricesDaily: StockPricesDaily[],
  instrument: MSAPIInstrument,
): Promise<number> => {
  const startTime = Date.now();
  const query = `
  mutation insertMarketData($input: [marketdata_stock_prices_daily_insert_input!]!) {
    insert_marketdata_stock_prices_daily(
      objects: $input
    ) {
      returning {
        feed
        inst_id
        price_open
        price_high
        price_low
        price_close
        ts_date
      }
    }
  }`;
  await queryHasura(query, { input: stockPricesDaily });
  logger.info(`Successfully saved ${stockPricesDaily.length
  } record(s) of daily bars of "${instrument}" [time: ${Date.now() - startTime} ms]`);
  return stockPricesDaily.length;
};

export const refreshPricesView = async (): Promise<void> => {
  const startTime = Date.now();
  await queryCore(`
  mutation Mutation {
    refreshPricesMaterializedView {
      success
    }
  }
  `);
  logger.info(`Successfully refreshed prices materialized view [time: ${Date.now() - startTime} ms]`);
};
