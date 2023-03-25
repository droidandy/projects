import { ExecutionResult } from 'graphql';
import connection from '../test-utils/connection';
import { gCall } from '../test-utils/gcall';
import { checkForbiddenError, getPriceForInstId, launchpadUserMetadata } from '../test-utils/common';


const createInstrumentQuery = (pattern: string, nMax?: number) =>
  `query Query {
    instruments(pattern: "${pattern}", nMax: ${nMax ? nMax : '20'}) {
      ... on Instruments {
        instruments {
          id
          symbol
          feeds
          exchange { name }
          currentPrice
          currentPriceDate
          currentPriceFeed
          yesterdayClosePrice
          yesterdayClosePriceDate
          yesterdayClosePriceFeed
          isLookupExactMatch
          shortDescription
          name

        }
      }
      ... on TooManyItemsRequestedError {
        message
        requestId
      }
    }
  }`;


describe('The GraphQL queries', () => {
  beforeAll(async () => {
    await connection.create();
  }, connection.creationTimeoutMs);
  afterAll(async () => {
    await connection.close();
  });
  beforeEach(() => jest.clearAllMocks());

  it('can return instruments', async () => {
    let result = await gCall({ source: createInstrumentQuery('') });
    expect(result.data.instruments.instruments.length).toEqual(0);

    result = await gCall({ source: createInstrumentQuery('MSFT') });
    expect(result.data.instruments.instruments.length).toEqual(1);

    result = await gCall({ source: createInstrumentQuery('AA') });
    expect(result.data.instruments.instruments.length).toEqual(3);
    expect(result.data.instruments.instruments[0].symbol).toEqual('AA');
    expect(result.data.instruments.instruments[0].isLookupExactMatch).toEqual(true);
    expect(result.data.instruments.instruments[1].symbol).toEqual('AAL');
    expect(result.data.instruments.instruments[1].isLookupExactMatch).toEqual(false);
    expect(result.data.instruments.instruments[2].symbol).toEqual('AAPL');
    expect(result.data.instruments.instruments[2].isLookupExactMatch).toEqual(false);

    const expectedPrice = await getPriceForInstId(result.data.instruments.instruments[2].id);
    const actualPrice = result.data.instruments.instruments[2].currentPrice.toString();
    expect(actualPrice).toEqual(expectedPrice);
    expect(['APEX', 'MORNING_STAR'].includes(result.data.instruments.instruments[2].currentPriceFeed)).toBeTruthy();
    expect(result.data.instruments.instruments[2].currentPriceDate).toBeTruthy();
    expect(result.data.instruments.instruments[2].currentPrice).toEqual(result.data.instruments.instruments[2].yesterdayClosePrice);
    expect(result.data.instruments.instruments[2].currentPriceDate).toEqual(result.data.instruments.instruments[2].yesterdayClosePriceDate);
    expect(result.data.instruments.instruments[2].currentPriceFeed).toEqual(result.data.instruments.instruments[2].yesterdayClosePriceFeed);

    // test nMax of 1
    result = await gCall({ source: createInstrumentQuery('AA', 1) });
    expect(result.data.instruments.instruments.length).toEqual(1);
    expect(result.data.instruments.instruments[0].symbol).toEqual('AA');
    expect(result.data.instruments.instruments[0].isLookupExactMatch).toEqual(true);

    // search by description
    result = await gCall({ source: createInstrumentQuery('apple') });
    expect(result.data.instruments.instruments.length).toEqual(1);
    expect(result.data.instruments.instruments[0].symbol).toEqual('AAPL');
    expect(result.data.instruments.instruments[0].name).toEqual('APPLE');
    expect(result.data.instruments.instruments[0].shortDescription).toEqual('APPLE INC');
    expect(result.data.instruments.instruments[0].isLookupExactMatch).toEqual(false);

    // Instrument with no price returns null for currentPrice
    result = await gCall({ source: createInstrumentQuery('kars', 1) });
    expect(result.data.instruments.instruments[0].currentPrice).toBeNull();

    // Search for % pattern
    result = await gCall({ source: createInstrumentQuery('%', 5) });
    expect(result.data.instruments.instruments.length).toEqual(5);
  });

  /*
  Disabled until the limit on the amount of requested data (nMax) returned.
  See note: products/core-be/src/resolvers/instrument.ts:100
  */
  it.skip('requesting too many items causes error', async () => {
    const result = await gCall({ source: createInstrumentQuery('apple', 21) });
    expect(result.data.instruments.requestId).toEqual(expect.any(String));
    expect(result.data.instruments.requestId.length).toBeGreaterThan(0);
  });

  describe('can return subqueries of instruments', () => {
    const createQuery = (subquery: string) =>
      `query Query {
        instruments(pattern: "AAPL" nMax: 1) {
          ... on Instruments {
            instruments {
              symbol
              ${subquery}
            }
          }
          ... on TooManyItemsRequestedError {
            tooManyItemsMessage: message
          }
        }
      }`;

    it('can return instruments->themes subquery', async () => {
      let result = await gCall({ source: createQuery('themes { id name instruments { symbol feeds exchange { name } } }') });
      expect(result.data.instruments.instruments[0].themes.length).toEqual(2);
      expect(result.data.instruments.instruments[0].themes[0].instruments.length > 6).toEqual(true);

      result = await gCall({ source: createQuery('themes(nMax: 1) { id name instruments(nMax: 1) { symbol feeds exchange { name } } }') });
      expect(result.data.instruments.instruments[0].themes.length).toEqual(1);
      expect(result.data.instruments.instruments[0].themes[0].instruments.length).toEqual(1);
    });

    it('cannot return instuments->stacks subquery without being authorized', async () => {
      let result = await gCall({
        source: createQuery('stacks { id name instruments { symbol } }'),
        graphQLErrorExpected: true
      });
      checkForbiddenError(result);

      result = await gCall({
        source: createQuery('stacks(nMax: 1) { id name instruments(nMax: 1) { symbol } }'),
        graphQLErrorExpected: true
      });
      checkForbiddenError(result);
    });

    it('can return instruments->stacks subquery', async () => {
      let result = await gCall({
        source: createQuery('stacks { id name instruments { symbol feeds exchange { name } } }'),
        contextValue: {
          metadata: launchpadUserMetadata
        }
      });
      expect(result.data.instruments.instruments[0].stacks.length).toEqual(2);
      expect(result.data.instruments.instruments[0].stacks[0].name).toEqual('Jason stack 1');
      expect(result.data.instruments.instruments[0].stacks[0].instruments.length > 1).toEqual(true);

      result = await gCall({
        source: createQuery('stacks(nMax: 1) { id name instruments(nMax: 1) { symbol feeds exchange { name } } }'),
        contextValue: {
          metadata: launchpadUserMetadata
        }
      });
      expect(result.data.instruments.instruments[0].stacks.length).toEqual(1);
      expect(result.data.instruments.instruments[0].stacks[0].name).toEqual('Jason stack 1');
      expect(result.data.instruments.instruments[0].stacks[0].instruments.length).toEqual(1);
    });

    it('cannot return instruments->hunches subquery without begin authorized', async () => {
      let result = await gCall({
        source: createQuery('hunches { id targetPrice instrument { symbol } }'),
        graphQLErrorExpected: true
      });
      checkForbiddenError(result);

      result = await gCall({
        source: createQuery('hunches(nMax: 1) { id targetPrice instrument { symbol } }'),
        graphQLErrorExpected: true
      });
      checkForbiddenError(result);
    });

    it('can return instuments->hunches subquery', async () => {
      let result = await gCall({
        source: createQuery('hunches { id targetPrice byDate instrument { symbol feeds exchange { name } } }'),
        contextValue: {
          metadata: launchpadUserMetadata
        }
      });
      expect(result.data.instruments.instruments[0].hunches.length).toEqual(1);
      expect(result.data.instruments.instruments[0].hunches[0].instrument.symbol).toEqual('AAPL');
      expect(result.data.instruments.instruments[0].hunches[0].targetPrice).toEqual(0.8);
      expect(result.data.instruments.instruments[0].hunches[0].byDate).toEqual('2021-10-21T00:00:00.000Z');

      result = await gCall({
        source: createQuery('hunches(nMax: 1) { id targetPrice instrument { symbol feeds exchange { name } } }'),
        contextValue: {
          metadata: launchpadUserMetadata
        }
      });
      expect(result.data.instruments.instruments[0].hunches.length).toEqual(1);
      expect(result.data.instruments.instruments[0].hunches[0].instrument.symbol).toEqual('AAPL');
      expect(result.data.instruments.instruments[0].hunches[0].targetPrice).toEqual(0.8);
    });

    it('can return instruments->feeds subquery', async () => {
      const result = await gCall({ source: createQuery('feeds') });
      expect(result.data.instruments.instruments[0].feeds.length).toEqual(1);
      expect(result.data.instruments.instruments[0].feeds[0]).toEqual('APEX');
    });

    it('can return instruments->exchange subquery', async () => {
      const result = await gCall({ source: createQuery('exchange { id name }') });
      expect(result.data.instruments.instruments[0].exchange.id).toEqual('4');
      expect(result.data.instruments.instruments[0].exchange.name).toEqual('NMS');
    });
  });

  const oneRandomInst = (instIds: string, subquery: string = '') => `
    query Query {
      oneRandomInst(instIds: [${instIds}]) {
        ... on Instrument {
          id
          symbol
          ${subquery}
        }
        ... on InstNotFoundError {
          instNotFoundMessage: message
        }
      }
    }`;

  it('returns one non-random instrument if only one instrument is passed', async () => {
    const result: ExecutionResult = await gCall({
      source: oneRandomInst('11')
    });
    expect(result.data.oneRandomInst.id).toEqual('11');
  });

  it('returns one random instrument from instruments passed', async () => {
    const result: ExecutionResult = await gCall({
      source: oneRandomInst('11,2662')
    });
    expect(result.data.oneRandomInst.id === '11' || result.data.oneRandomInst.id === '2662').toBe(true);
  });

  it('returns InstNotFoundError if instruments do not exist', async () => {
    const result: ExecutionResult = await gCall({
      source: oneRandomInst('-2662')
    });
    expect(result.data.oneRandomInst.instNotFoundMessage).toContain('-2662');
  });

  it('returns subqueries for one non-random instrument', async () => {
    let result: ExecutionResult = await gCall({
      source: oneRandomInst('2662', 'feeds exchange { name } themes { id }')
    });
    expect(result.data.oneRandomInst.themes).toHaveLength(2);

    result = await gCall({
      source: oneRandomInst('2662', 'feeds themes { id }')
    });
    expect(result.data.oneRandomInst.themes).toHaveLength(2);

    result = await gCall({
      source: oneRandomInst('2662', 'exchange { name } themes { id }')
    });
    expect(result.data.oneRandomInst.themes).toHaveLength(2);

    result = await gCall({
      source: oneRandomInst('2662', 'feeds exchange { name } themes(nMax: 1) { id }')
    });
    expect(result.data.oneRandomInst.themes).toHaveLength(1);

    result = await gCall({
      source: oneRandomInst('2662', 'feeds themes(nMax: 1) { id }')
    });
    expect(result.data.oneRandomInst.themes).toHaveLength(1);

    result = await gCall({
      source: oneRandomInst('2662', 'exchange { name } themes(nMax: 1) { id }')
    });
    expect(result.data.oneRandomInst.themes).toHaveLength(1);
  });

  it('can return all exchanges', async () => {
    const result: ExecutionResult = await gCall({
      source: `
        query Query {
          exchanges {
            ... on Exchanges {
              exchanges {
                id
                name
              }
            }
          }
        }`,
      variableValues: {}
    });
    expect(result.data.exchanges.exchanges.length).toEqual(4);
  });
  it('can return exchange by name', async () => {
    const result: ExecutionResult = await gCall({
      source: `
        query Query {
          exchanges(name: "NYSE") {
            ... on Exchanges {
              exchanges {
                id
                name
              }
            }
          }
        }`,
      variableValues: {}
    });
    expect(result.data.exchanges.exchanges.length).toEqual(1);
    expect(result.data.exchanges.exchanges[0].name).toEqual('NYSE');
  });
});
