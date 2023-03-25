import { ExecutionResult } from 'graphql';
import connection from '../test-utils/connection';
import { gCall } from '../test-utils/gcall';
import { CommStack } from '../models/comm-stack';
import { checkForbiddenError, launchpadUserMetadata } from '../test-utils/common';

describe('The GraphQL community stack queries', () => {
  beforeAll(async () => {
    await connection.create();
  }, connection.creationTimeoutMs);
  afterAll(async () => {
    await connection.close();
  });
  beforeEach(() => jest.clearAllMocks());

  it('can return communityStacks', async () => {
    const result = await gCall({
      source: `
        query Query {
          communityStacks {
            ... on CommStacks {
              commStacks {
                id
                name
                instruments {
                  type
                  symbol
                  feeds
                  exchange { name }
                }
              }
            }
          }
        }
        `
    });
    expect(result.data.communityStacks.commStacks.length).toEqual(2);
  });

  it('can return 1 communityStack with 2 instruments', async () => {
    const result: ExecutionResult = await gCall({
      source: `
        query Query ($communityStacksLimit: Int, $instrumentsLimit: Int) {
          communityStacks(nMax: $communityStacksLimit) {
            ... on CommStacks {
              commStacks {
                id
                name
                instruments(nMax: $instrumentsLimit) {
                  type
                  symbol
                  feeds
                  exchange { name }
                  isLookupExactMatch
                }
              }
            }
          }
        }
        `,
      variableValues: {
        communityStacksLimit: 1,
        instrumentsLimit: 2
      }
    });
    expect(result.data.communityStacks.commStacks.length).toEqual(1);
    expect(result.data.communityStacks.commStacks[0].instruments.length).toEqual(2);
    expect(result.data.communityStacks.commStacks[0].instruments[0].isLookupExactMatch).toBeNull();
    expect(result.data.communityStacks.commStacks[0].instruments[1].isLookupExactMatch).toBeNull();
  });

  describe('can return subqueries of communityStack->instruments', () => {
    const createQuery = (subquery: string) =>
      `query Query {
        communityStacks {
          ... on CommStacks {
            commStacks {
              id
              name
              ${subquery}
            }
          }
        }
      }`;

    const getCommStack = (result: any): CommStack => result.data.communityStacks.commStacks.find((cs: any) => cs.name === 'TOP10');

    it('can return communityStack->instruments->themes subquery', async () => {
      let result = await gCall({ source: createQuery('instruments { symbol feeds exchange{name} themes {id}}') });
      expect(getCommStack(result).instruments.length > 1).toEqual(true);
      expect(getCommStack(result).instruments[0].themes.length > 1).toEqual(true);

      result = await gCall({ source: createQuery('instruments { symbol feeds exchange{name} themes(nMax: 1) {id}}') });
      expect(getCommStack(result).instruments.length > 1).toEqual(true);
      expect(getCommStack(result).instruments[0].themes.length).toEqual(1);

      result = await gCall({ source: createQuery('instruments(nMax: 1) { symbol feeds exchange{name} themes(nMax: 1) {id}}') });
      expect(getCommStack(result).instruments.length).toEqual(1);
      expect(getCommStack(result).instruments[0].themes.length).toEqual(1);

      result = await gCall({ source: createQuery('instruments(nMax: 1) { symbol feeds exchange{name} themes {id}}') });
      expect(getCommStack(result).instruments.length).toEqual(1);
      expect(getCommStack(result).instruments[0].themes.length > 1).toEqual(true);
    });

    it('cannot return communityStack->instruments->stacks subquery without being authorized', async () => {
      let result = await gCall({ source: createQuery('instruments { symbol stacks {id}}'), graphQLErrorExpected: true });
      checkForbiddenError(result);

      result = await gCall({ source: createQuery('instruments(nMax: 1) { symbol stacks(nMax: 1) {id}}'), graphQLErrorExpected: true });
      checkForbiddenError(result);
    });

    it('can return communityStack->instruments->stacks subquery', async () => {
      let result = await gCall({
        source: createQuery('instruments { symbol stacks {id}}'),
        contextValue: { metadata: launchpadUserMetadata }
      });
      expect(getCommStack(result).instruments.find(({ symbol }) => symbol === 'AAPL').stacks.length > 1).toEqual(true);

      result = await gCall({
        source: createQuery('instruments { symbol stacks(nMax: 1) {id}}'),
        contextValue: { metadata: launchpadUserMetadata }
      });
      expect(getCommStack(result).instruments.find(({ symbol }) => symbol === 'AAPL').stacks.length).toEqual(1);
    });

    it('cannot return communityStack->instruments->hunches subquery without being authorized', async () => {
      let result = await gCall({ source: createQuery('instruments { symbol hunches {id}}'), graphQLErrorExpected: true });
      checkForbiddenError(result);

      result = await gCall({ source: createQuery('instruments(nMax: 1) { symbol hunches(nMax: 1) {id}}'), graphQLErrorExpected: true });
      checkForbiddenError(result);
    });

    it('can return communityStack->instruments->hunches subquery', async () => {
      let result = await gCall({
        source: createQuery('instruments { symbol hunches {id}}'),
        contextValue: { metadata: launchpadUserMetadata }
      });
      expect(getCommStack(result).instruments.find(({ symbol }) => symbol === 'AAPL').hunches.length).toEqual(1);

      result = await gCall({
        source: createQuery('instruments { symbol hunches(nMax: 1) {id}}'),
        contextValue: { metadata: launchpadUserMetadata }
      });
      expect(getCommStack(result).instruments.find(({ symbol }) => symbol === 'AAPL').hunches.length).toEqual(1);
    });
  });
});
