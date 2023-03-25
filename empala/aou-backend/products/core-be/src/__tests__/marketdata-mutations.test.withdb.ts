/* eslint-disable @typescript-eslint/no-var-requires*/
import { ExecutionResult } from 'graphql';
import * as _ from 'lodash';
import seedrandom from 'seedrandom';
import { EAccessRole } from '../security/auth-checker';
import connection from '../test-utils/connection';
import { gCall } from '../test-utils/gcall';
import { EFeed } from '../models/instrument-feed';
import { CreateInstrumentInput } from '../inputs/create-instrument';
import { EInstrumentType } from '../models/instrument';
import { ECountry } from '../enums/country';

const TIMEOUT_MILLIS = 90_000;
const createInstrumentInputAPEX200 = require('./data/create-instruments/create-instrument-input-apex.json');
const createInstrumentInputMS1000 = require('./data/create-instruments/create-instrument-input-ms.json');
const InstrumentNameChangeInput = require('./data/create-instruments/name-change-instrument-input.json');
const instrumentsToBeRenamed = require('./data/create-instruments/instruments-to-be-renamed.json');

const gCallQuery = async (source: string, variableValues?: any) => {
  variableValues = variableValues || undefined;
  return gCall({ source, variableValues });
};

const gCallMutation = async (source: string, variableValues?: any) => {
  variableValues = variableValues || undefined;
  return gCall({ source, variableValues, contextValue: { metadata: { role: EAccessRole.MARKETDATA_UPDATER } } });
};


describe('The GraphQL marketdata mutations', () => {
  beforeAll(async () => {
    await connection.create();
  }, connection.creationTimeoutMs);
  afterAll(async () => {
    await connection.close();
  });
  beforeEach(() => jest.clearAllMocks());

  it('can refresh materialized view with prices', async () => {
    const result: ExecutionResult = await gCallMutation(`
      mutation Mutation {
        refreshPricesMaterializedView {
          success
        }
      }
      `
    );
    expect(result.data.refreshPricesMaterializedView.success).toBeTruthy();
  });

  describe('createInstruments mutations should work properly', () => {

    const createInstrumentMutation = `
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
          instruments {
            id
            symbol
            cusip
            type
            description
            feeds
            exchange { name }
            themes { name }
          }
        }
      }
    }
  `;

    const instrumentQuery = (instId: string) => `
  query Query {
    oneRandomInst(instIds: ["${instId}"]) {
      ... on Instrument {
        id
        exchange {
          id
          name
        }
        cusip
        symbol
        feeds
        type
        description
        shortDescription,
        country
      }
    }
  }
  `;

    const INSTRUMENT_DATA: CreateInstrumentInput = {
      symbol: 'TEST_ETF',
      cusip: 'TEST_ETF_CUSIP',
      sedol: 'TEST_ETF_SEDOL',
      type: EInstrumentType.ETF,
      exchangeName: 'NYSE',
      description: 'TEST DESCRIPTION 123123',
      shortDescription: 'TEST DESCRIPTION',
      country: ECountry.USA
    };

    it('Can create an instrument for APEX', async () => {
      const { data: { createInstruments: { instruments } } }: ExecutionResult
        = await gCallMutation(createInstrumentMutation,
        {
          feed: EFeed.APEX,
          instruments: INSTRUMENT_DATA,
          nameChanges: null
        }
      );

      expect(instruments.length).toEqual(1);

      // The values of the fields in the response of create/update request must match the passed values
      const [upsertedInstrument] = instruments;
      expect(upsertedInstrument.symbol).toEqual(INSTRUMENT_DATA.symbol);
      expect(upsertedInstrument.cusip).toEqual(INSTRUMENT_DATA.cusip);

      // The values of the fields in the response of request for the data of the new instrument by its id
      // must correspond to the passed values.
      const instrumentQueryResult = await gCallQuery(instrumentQuery(upsertedInstrument.id));
      const instrument = instrumentQueryResult.data.oneRandomInst;
      expect(instrument.symbol).toEqual(INSTRUMENT_DATA.symbol);
      expect(instrument.feeds).toEqual(['APEX']);
    });

    it('Can update the same instrument for APEX. And receive extended set of fields in response', async () => {
      const changedDescription = 'CHANGED TEST DESCRIPTION';
      const { data: { createInstruments: { instruments } } }: ExecutionResult
        = await gCallMutation(createInstrumentMutation,
        {
          feed: EFeed.APEX,
          instruments: { ...INSTRUMENT_DATA, description: changedDescription },
          nameChanges: null
        });

      expect(instruments.length).toEqual(1);

      const [upsertedInstrument] = instruments;

      // The values of the fields in the response of create/update request must match the passed values
      expect(upsertedInstrument.symbol).toEqual(INSTRUMENT_DATA.symbol);
      expect(upsertedInstrument.cusip).toEqual(INSTRUMENT_DATA.cusip);
      expect(upsertedInstrument.description).toEqual(changedDescription);
      expect(upsertedInstrument.themes).toEqual([]);
      expect(upsertedInstrument.feeds).toEqual(['APEX']);
      expect(upsertedInstrument.exchange.name).toEqual('NYSE');

      // The values of the fields in the response of request for the data of the new instrument by its id
      // must correspond to the passed values.
      const instrumentQueryResult = await gCallQuery(instrumentQuery(upsertedInstrument.id));
      const instrument = instrumentQueryResult.data.oneRandomInst;
      expect(instrument.symbol).toEqual(INSTRUMENT_DATA.symbol);
      expect(instrument.description).toEqual(changedDescription);
      expect(instrument.feeds).toEqual(['APEX']);
    });

    it('Can add new feed (MS) for existing instrument', async () => {
      const { data: { createInstruments: { instruments } } }: ExecutionResult
        = await gCallMutation(createInstrumentMutation,
        {
          feed: EFeed.MORNING_STAR,
          instruments: INSTRUMENT_DATA,
          nameChanges: null
        });

      expect(instruments.length).toEqual(1);

      // All instrument fields (except description which gets the initial value)
      // should remain unchanged...

      const [upsertedInstrument] = instruments;
      expect(upsertedInstrument.symbol).toEqual(INSTRUMENT_DATA.symbol);
      expect(upsertedInstrument.cusip).toEqual(INSTRUMENT_DATA.cusip);

      // ...check the same by requesting the instrument data by id
      const instrumentQueryResult = await gCallQuery(instrumentQuery(upsertedInstrument.id));
      const instrument = instrumentQueryResult.data.oneRandomInst;
      expect(instrument.symbol).toEqual(INSTRUMENT_DATA.symbol);
      expect(instrument.cusip).toEqual(INSTRUMENT_DATA.cusip);

      // ...but MORNING_STAR should be added to the list of feeds

      expect(instrument.feeds).toEqual(['APEX', 'MORNING_STAR']);
    });

    it('Can use empty input for instruments creation', async () => {
      const result: ExecutionResult = await gCallMutation(createInstrumentMutation,
        {
          feed: EFeed.APEX,
          instruments: [],
          nameChanges: null
        });
      expect(result.data.createInstruments.instruments.length).toEqual(0);
    });

    it('Can save 3 non existing instrument with NMS', async () => {
      const exchangeName = 'NMS';
      const instrumentData = [];
      for (let iInstrument = 0; iInstrument < 3; iInstrument++) {
        instrumentData.push({
          ...JSON.parse(JSON.stringify(INSTRUMENT_DATA)),
          exchangeName,
          symbol: INSTRUMENT_DATA.symbol + iInstrument,
          cusip: INSTRUMENT_DATA.cusip + iInstrument
        } as CreateInstrumentInput);
      }

      const result: ExecutionResult = await gCallMutation(createInstrumentMutation,
        {
          feed: EFeed.MORNING_STAR,
          instruments: instrumentData,
          nameChanges: null
        });
      for (let iInstrument = 0; iInstrument < 3; iInstrument++) {
        const instrumentQueryResult = await gCallQuery(instrumentQuery(result.data.createInstruments.instruments[iInstrument].id));
        const instrument = instrumentQueryResult.data.oneRandomInst;
        expect(instrument.symbol).toEqual(instrumentData[iInstrument].symbol);
        expect(instrument.cusip).toEqual(instrumentData[iInstrument].cusip);
        expect(instrument.exchange.name).toEqual(exchangeName);
        expect(instrument.feeds).toEqual(['MORNING_STAR']);
      }
    });

    it('Can save instruments packet: 1 new and 1 existing', async () => {
      /*
      Let's save a package of 2 instruments within the MORNING_STAR feed.
      One instrument is new, the other is existing (symbol = 'QQQ', exchange = 'NMS', feeds = ['APEX'])
      For both, we will specify the exchange = ARCA.
      We expect the addition of a new instrument
      and updating the existing one:
        - changing the value of the exchange
        - adding the MORNING_STAR feed
       */
      const ARCA = 'ARCA';

      const exchangeQuery = (name: string) => `
      query Query {
        exchanges(name: "${name}") {
          ... on Exchanges {
            exchanges {
              id
              name
            }
          }
        }
      }
    `;

      const exchangeQueryResult = await gCallQuery(exchangeQuery(ARCA));
      const { data: { exchanges: { exchanges: [{ id: ARCAid }] } } } = exchangeQueryResult;


      const instrumentsPacket = [];

      const newInstrumentSymbol = 'NEW_SYMBOL';
      const newInstrumentData: CreateInstrumentInput = {
        ...INSTRUMENT_DATA,
        symbol: newInstrumentSymbol,
        cusip: 'new_cusip',
        exchangeName: ARCA,
      };
      instrumentsPacket.push(newInstrumentData);

      const existingInstId = '1'; // symbol = 'QQQ', exchange = 'NMS', feeds = ['APEX']
      const { data: { oneRandomInst: existingInstrument } } = await gCallQuery(instrumentQuery(existingInstId));

      const existingInstrumentData: CreateInstrumentInput = {
        ..._.pick(existingInstrument, ['symbol', 'cusip', 'sedol', 'type', 'description', 'shortDescription', 'country'])
        , exchangeName: ARCA
      };
      instrumentsPacket.push(existingInstrumentData);

      const { data: { createInstruments: { instruments } } }: ExecutionResult = await gCallMutation(createInstrumentMutation,
        {
          feed: EFeed.MORNING_STAR,
          instruments: instrumentsPacket,
          nameChanges: null
        });

      expect(instruments).toEqual(expect.arrayContaining([
        expect.objectContaining({ cusip: newInstrumentData.cusip, symbol: newInstrumentSymbol }),
        expect.objectContaining({
          cusip: existingInstrumentData.cusip,
          symbol: existingInstrumentData.symbol
        })
      ]));

      // So, we have added a new instrument traded on the ARCA exchange, prices for which we get from MORNING_STAR.
      // There should be a new instrument for the ARCA exchange having a link with feed MORNING_STAR

      const [{ id: newInstrumentId }] = instruments.filter(({ symbol }: any) => symbol === newInstrumentSymbol);
      const { data: { oneRandomInst: newInstrument } } = await gCallQuery(instrumentQuery(newInstrumentId));
      expect(newInstrument).toEqual(expect.objectContaining({
        ..._.pick(newInstrumentData, ['cusip', 'description', 'shortDescription', 'symbol', 'type', 'country']),
        exchange: { name: ARCA, id: ARCAid },
        feeds: [EFeed.MORNING_STAR]
      }));

      // Before we had a QQQ instrument traded on the NMS exchange, prices for which we get from APEX
      // We have place in packet QQQ instrument traded on the ARCA exchange and related with MORNING_STAR
      // We expect to see it's field "exchange" changed to ARCA and it have two links with feeds APEX and MORNING_STAR

      const { data: { oneRandomInst: updatedInstrument } } = await gCallQuery(instrumentQuery(existingInstId));
      expect(updatedInstrument).toEqual(expect.objectContaining({
        ..._.pick(existingInstrumentData, ['cusip', 'description', 'shortDescription', 'symbol', 'type', 'country']),
        id: existingInstId,
        exchange: { name: ARCA, id: ARCAid },
        feeds: expect.arrayContaining([EFeed.MORNING_STAR, EFeed.APEX])
      }));
    });

    // TODO add check
    it('Upsert 200 APEX symbols', async () => {
      const result: ExecutionResult
        = await gCallMutation(createInstrumentMutation,
        {
          feed: EFeed.APEX,
          instruments: createInstrumentInputAPEX200
        }
      );
      const { data: { createInstruments: { instruments } } } = result;
      expect(instruments.length).toBeGreaterThan(1);
    }, TIMEOUT_MILLIS);

    it('Upsert 1000 MS symbols with name changes', async () => {
      const result: ExecutionResult
        = await gCallMutation(createInstrumentMutation,
          {
            feed: EFeed.MORNING_STAR,
            instruments: createInstrumentInputMS1000,
            nameChanges: InstrumentNameChangeInput
          }
        );
      const { data: { createInstruments: { instruments } } } = result;
      expect(instruments.length).toBeGreaterThan(1);
    }, TIMEOUT_MILLIS);

    const NUMBER_OF_INSTRUMENTS = 10_000;

    it(`Can save a huge number of instruments (${NUMBER_OF_INSTRUMENTS})`, async () => {
      const instrumentsPacket = [];
      // @ts-ignore
      const rng = seedrandom('test_10k_inst');
      for (let i = 0; i < NUMBER_OF_INSTRUMENTS; i++) {
        const s = `s${i}`;
        instrumentsPacket.push({
          symbol: s,
          cusip: s,
          sedol: s,
          type: rng.quick() > 0.5 ? EInstrumentType.ETF : EInstrumentType.STOCK,
          exchangeName: rng.quick() > 0.5 ? 'NYSE' : 'ARCA',
          description: s,
          shortDescription: s,
          country: rng.quick() > 0.5 ? ECountry.USA : ECountry.GBR
        });
      }
      const { data: { createInstruments: { instruments } } }: ExecutionResult = await gCallMutation(createInstrumentMutation,
        {
          feed: EFeed.MORNING_STAR,
          instruments: instrumentsPacket,
          nameChanges: null
        });

      expect(instruments.length).toEqual(NUMBER_OF_INSTRUMENTS);
    }, TIMEOUT_MILLIS);

  });

  const exchangeMutation = `
  mutation Mutation($createExchangeInput: CreateExchangeInput!) {
    createExchange(input: $createExchangeInput) {
      ... on CreateExchangeSuccess {
        exchange {
          name
          id
          country
        }
      }
      ... on CreateExchangeAlreadyExistsError {
        message
        requestId
      }
    }
  }`;

  it('Can create an exchange', async () => {
    const exchangeName = 'NASDAQ';
    const country = 'USA';
    const result: ExecutionResult = await gCallMutation(exchangeMutation,
      { createExchangeInput: { name: exchangeName, country } }
    );
    expect(result.data.createExchange.exchange.name).toEqual(exchangeName);
    expect(result.data.createExchange.exchange.country).toEqual(country);
  });

  it('Can\'t create an exchange with the same name', async () => {
    const exchangeName = 'NASDAQ';
    const country = 'USA';
    const result: ExecutionResult = await gCallMutation(exchangeMutation,
      { createExchangeInput: { name: exchangeName, country } }
    );
    expect(result.data.createExchange.message).toEqual(`Exchange with name '${exchangeName}' already exists`);
    expect(result.data.createExchange.requestId).toEqual(expect.any(String));
    expect(result.data.createExchange.requestId.length).toBeGreaterThan(0);
  });
});
