import { queryCore, queryHasura } from '../../lib/db';

export const getInstrumentBySymbol = async (symbol: string): Promise<any> => {
  const query = `
    query Query {
      instruments(pattern: "${symbol}", nMax: 1) {
        ... on Instruments {
          instruments {
            id
            type
            symbol
            country
            cusip
            description
            shortDescription
            currentPrice
            currentPriceDate
            currentPriceFeed
            feeds
            exchange {
              name
            }
          }
        }
      }
    }
  `;
  const result = await queryCore(query);
  return result.instruments.instruments[0];
};

export const isInstrumentPresent = async (symbol: string): Promise<boolean> => {
  const result = await getInstrumentBySymbol(symbol);
  return !!result;
};

export const getInstrumentStockPrices = async (instIds: number[], date?: string): Promise<any[]> => {
  const dateCondition: string = date ? `{ts_date: {_eq: "${date}"}},` : '';
  const query = `
  query MyQuery {
    prices: marketdata_stock_prices_daily(
      where: {
        _and: [
          ${dateCondition},
          {inst_id: {_in: [${instIds.join(',')}]}},
          {feed: { _eq: APEX}}
        ]
      }
    ) {
      feed
      inst_id
      price_close
      ts_date
    }
  }
  `;
  const response = await queryHasura(query);
  return response.prices;
};
