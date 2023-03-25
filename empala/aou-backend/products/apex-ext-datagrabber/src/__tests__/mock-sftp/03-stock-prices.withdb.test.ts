import '../../init';
import { queryHasura } from '../../lib/db';

const getPricesFromViewQuery = (conditions = '', period: 'monthly' | 'daily' | 'weekly' = 'daily') => `
    query Query {
      marketdata_view_stock_prices_${period}(${conditions}) {
        inst_id
        price_close
        price_high
        price_low
        price_open
        ts_date
      }
    }
  `;

describe('Hasura queries', () => {

  it('can return daily prices', async () => {
    const filterById = 'where: {inst_id: {_eq: "1"}}';
    const result = await queryHasura(getPricesFromViewQuery(filterById));
    expect(result.marketdata_view_stock_prices_daily[0].inst_id).toBe(1);
  });

  it('can return weekly prices with filtering by date', async () => {
    const filterById = 'where: {inst_id: {_eq: "1"}, ts_date: {_gt: "2021-01-01", _lt: "2021-12-31"}}';
    const result = await queryHasura(getPricesFromViewQuery(filterById, 'weekly'));
    const prices = result.marketdata_view_stock_prices_weekly;
    expect(prices[0].inst_id).toBe(1);
    const secondDate = new Date('2021-12-31').getTime();
    const firstDate = new Date('2021-01-01').getTime();
    for (const price of prices) {
      const priceDate = new Date(price.ts_date);
      expect(priceDate.getTime() > firstDate).toBeTruthy();
      expect(priceDate.getTime() < secondDate).toBeTruthy();
    }
  });

  it('can return monthly prices with aggregation', async () => {
    const query = `
      query MyQuery {
        data: marketdata_view_stock_prices_monthly_aggregate(where: {inst_id: {_eq: "1"}, ts_date: {_gte: "2020-01-01", _lte: "2021-12-31"}}) {
          aggregate {
            avg {
              price_close
            }
          }
          nodes {
            inst_id
            price_close
            ts_date
          }
        }
      }
    `;
    const { data } = await queryHasura(query);
    const prices = data.nodes;
    const responseAvg = data.aggregate.avg.price_close;
    const secondDate = new Date('2021-12-31').getTime();
    const firstDate = new Date('2020-01-01').getTime();
    let priceCloseSum = 0;
    for (const price of prices) {
      const priceDate = new Date(price.ts_date);
      expect(priceDate.getTime() > firstDate).toBeTruthy();
      expect(priceDate.getTime() < secondDate).toBeTruthy();
      priceCloseSum += price.price_close;
    }
    const avgPriceClose = priceCloseSum / prices.length;
    expect(parseFloat(avgPriceClose.toFixed(5))).toEqual(parseFloat(responseAvg.toFixed(5)));
  });
});
