/* istanbul ignore file */
import { gql, GraphQLClient } from 'graphql-request';
import { CreateInstrumentInput, EFeed } from '../types/gql-types';
import { logger } from './logger';
import { getCoreAccessToken } from './token';
import { timeTaken } from './utils';
import AError from './a-error';

let coreClient: GraphQLClient;
export const queryCore = async (query: string, values: any = null): Promise<any> => {
  if (!coreClient) {
    const endpoint = process.env.APOLLO_SERVER_HOST_URI;
    coreClient = new GraphQLClient(endpoint);
  }
  const token = await getCoreAccessToken();
  coreClient.setHeader('authorization', `Bearer ${token}`);
  return values ? coreClient.request(query, values) : coreClient.request(query);
};

let hasuraClient: GraphQLClient;
export const queryHasura = async (query: string, values: any = null): Promise<any> => {
  if (!hasuraClient) {
    const hasuraEndpoint = process.env.HASURA_GRAPHQL_ENDPOINT;
    hasuraClient = new GraphQLClient(hasuraEndpoint);
  }
  hasuraClient.setHeader('X-Hasura-Admin-Secret', process.env.HASURA_GRAPHQL_ADMIN_SECRET);
  return values ? hasuraClient.request(query, values) : hasuraClient.request(query);
};

export const upsertInstruments = async (
  instrumentsInput: CreateInstrumentInput[],
): Promise<ShortInstrumentData[]> => {
  const feed = EFeed.APEX;
  const query = gql`
    mutation saveMissingInstruments(
      $feed: EFeed!,
      $instrumentsInput: [CreateInstrumentInput!]!
    ) {
      createInstruments(feed: $feed, instruments: $instrumentsInput) {
        ... on CreateInstrumentSuccess {
          instruments{
            id
            cusip
            symbol
          }
        }
      }
    }
  `;
  const response = await queryCore(query, { feed, instrumentsInput });
  return response.createInstruments.instruments as ShortInstrumentData[];
};

/**
 * Fill instrumentsCache by the full list of instruments available in the DB for APEX feed and US
 * in the form of <symbol> -> <id>, <cusip> -> <id> (cusip is needed in cases when the instrument was renamed
 * and it cannot be found by its old symbol )
 */
export const fillInstrumentsCache = async (instrumentsCache: InstrumentsCache): Promise<void> => {
  const feed = EFeed.APEX;
  const query = gql`query mq($feed: EFeed) {
    inst: instrumentsInfo(feed: $feed) {
      ... on Instruments {
        instruments {
          id
          symbol
        }
      }
    }
  }`;
  const { inst: { instruments } } = await queryCore(query, { feed });
  instruments.forEach((row: any) => {
    const { id, symbol } = row;
    // eslint-disable-next-line no-param-reassign
    instrumentsCache[symbol] = id;
  });
};

export const refreshPricesView = async (): Promise<void> => {
  const startTime = Date.now();
  await queryCore(gql`
    mutation Mutation {
      refreshPricesMaterializedView {
        success
      }
    }
  `);
  logger.info(`Successfully refreshed prices materialized view ${timeTaken(startTime)}`);
};

// ----------------------------- HASURA --------------------------------

export const saveInstrumentPriceClose = async (
  closePriceData: ClosePriceData[],
): Promise<any> => {
  const query = `
  mutation insertMarketData($input: [marketdata_stock_prices_daily_insert_input!]!) {
    insert_marketdata_stock_prices_daily(objects: $input) {
      returning {
        inst_id
      }
    }
  }
  `;
  return queryHasura(query, { input: closePriceData });
};

export const getExistingPriceDates = async (startDate: ISODateString, endDate: ISODateString): Promise<ISODateString[]> => {
  try {
    const query = `
      query MyQuery {
        dates: marketdata_stock_prices_daily(where: {
          feed: {_eq: APEX},
          ts_date: {
            _gte: "${startDate}",
            _lte: "${endDate}"}
          },
          order_by: {ts_date: asc},
          distinct_on: ts_date
        ) {
          d: ts_date
        }
      }`;
    const { dates }: { dates: string[] } = await queryHasura(query);
    return dates.map(({ d }: any) => d);
  } catch (err: Error | any) {
    err.message = `Loading marketdata_stock_prices_daily failed with error: ${err.message}`;
    throw new AError(err);
  }
};
