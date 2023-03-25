import connection from '../test-utils/connection';
import { gCall } from '../test-utils/gcall';
import { InstNotFoundError } from '../errors/inst-not-found';
import { instrumentLogosMutation, instrumentQueryForLogos } from '../test-utils/queries';
import { ExecutionResult } from 'graphql';
import { CreateInstrumentLogosSuccess } from '../results/create-instrument-logos';
import { EAccessRole } from '../security/auth-checker';
import { getConnection } from 'typeorm';
import { InstrumentLogos } from '../models/instrument-logos';
import { isValidLogosObject } from '../../../utils/src/test-utils/matchers';

const httpPattern = /^https?:\/\//;

const APPLE_SYMBOL = 'AAPL';
const APPLE_INST_ID = 2662;

describe('Instrument logos queries & mutations', () => {
  beforeAll(async () => {
    await connection.create();
  }, connection.creationTimeoutMs);

  afterAll(async () => {
    await connection.close();
  });

  const createInstrumentLogos = async (input: Record<string, any>): Promise<InstrumentLogos> => {
    const creationResult: ExecutionResult = await gCall({
      source: instrumentLogosMutation,
      variableValues: { input },
      contextValue: { metadata: { role: EAccessRole.MARKETDATA_UPDATER } } 
    });
    const { logos } = creationResult.data.createInstrumentLogos as CreateInstrumentLogosSuccess;
    return logos;
  }

  it('returns error for absent logos', async () => {
    const instruments = await gCall({ source: String(instrumentQueryForLogos(APPLE_INST_ID)) });
    const { symbol, logos } = instruments.data.oneRandomInst;

    expect(symbol).toEqual(APPLE_SYMBOL);
    expect((logos as InstNotFoundError).message).toBe(
      `Logos for ${symbol} not found`
    );
  });

  it('can create logos for instrument', async () => {
    const input = {
      instId: APPLE_INST_ID,
      logo: 'some temporary value',
      logoNormal: 'some temporary value',
      logoOriginal: 'some temporary value',
      logoSquare: 'some temporary value',
      logoSquareStrict: 'some temporary value',
      logoThumbnail: 'some temporary value',
    };

    const logos = await createInstrumentLogos(input);

    expect(logos).toEqual(expect.objectContaining({
      id: expect.any(String),
    }));
  });
  
  it('can update logos for instrument', async () => {
    const input = {
      instId: APPLE_INST_ID,
      logo: 'https://dbm39xf7iio2y.cloudfront.net/2662/logo',
      logoNormal: 'https://dbm39xf7iio2y.cloudfront.net/2662/logo_normal',
      logoOriginal: 'https://dbm39xf7iio2y.cloudfront.net/2662/logo_original',
      logoSquare: 'https://dbm39xf7iio2y.cloudfront.net/2662/logo_square',
      logoSquareStrict: 'https://dbm39xf7iio2y.cloudfront.net/2662/logo_square_strict',
      logoThumbnail: 'https://dbm39xf7iio2y.cloudfront.net/2662/logo_thumbnail',
    };

    const logos = await createInstrumentLogos(input);

    expect(logos).toEqual(expect.objectContaining({
      id: expect.any(String),
    }));
  });

  it('can fetch logos for instrument', async () => {
    await getConnection().queryResultCache.clear();
    
    const instruments = await gCall({ source: instrumentQueryForLogos(APPLE_INST_ID) });
    const { logos } = instruments.data.oneRandomInst;

    expect(logos).toEqual(expect.objectContaining({
      instrument: expect.objectContaining({
        id: expect.any(String),
        symbol: expect.any(String),
      }),
    }));
    expect(isValidLogosObject(logos)).toBe(true);
  });
});
