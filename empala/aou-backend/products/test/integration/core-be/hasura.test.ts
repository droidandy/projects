import { GraphQLClient, gql } from 'graphql-request';

const hasuraEndpoint = process.env.HASURA_GRAPHQL_ENDPOINT || 'http://localhost:8080/v1/graphql';
const hasuraAdminSecret: string = process.env.HASURA_GRAPHQL_ADMIN_SECRET || 'myadminsecretkey';
const client = new GraphQLClient(hasuraEndpoint);

describe('Hasura GraphQL server can', () => {
  it('return instrument prices', async () => {
    const data = await client.request(gql`
      query MyQuery {
        marketdata_stock_prices_daily(where: {_and: [{ts_date: {_eq: "2000-01-03"}}, {inst_id: {_in: [2662, 7585]}}, {feed: {_eq: MORNING_STAR}}]}) {
          feed
          inst_id
          price_close
          ts_date
        }
      }
      `, undefined, { 'x-hasura-admin-secret': hasuraAdminSecret });
    expect(data.marketdata_stock_prices_daily).toHaveLength(2);
  });
});
