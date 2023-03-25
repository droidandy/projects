import '../init/init';
import { logger as testLogger } from '../lib/logger';
import setupTestDB, { KEEP_ROWS_NUMBER } from './test-utils/setup-tests';
import { main } from '../main';
import { Connection, createConnection } from 'typeorm';
import { matcher } from './test-utils/matcher';
import axios from 'axios';

let connection: Connection;
let logos: InstrumentLogosResponse[];

describe('Check microservice', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await setupTestDB();
  }, 500000);

  afterAll(async () => {
    await connection.close();
  });

  test('no logos in the beginning', async () => {
    const [{ count }] = await connection.query(`
      SELECT COUNT(*) FROM instruments.logos
    `);
    expect(Number(count)).toBe(0);
  });

  it('does its job and finishes correctly', async () => {
    try {
      const completeState = await main();
      expect(completeState).toBe(1);
    } catch (e) {
      testLogger.error(e);
    }
  });

  test('now logos are present', async () => {
    logos = await connection.query(`
      SELECT * FROM instruments.logos
    `);

    expect(logos.length).toBe(KEEP_ROWS_NUMBER);

    logos.forEach(l => {
      expect(l).toEqual(expect.objectContaining({
        id: expect.any(String),
        inst_id: expect.any(String),
        logo: matcher,
        logo_original: matcher,
        logo_normal: matcher,
        logo_thumbnail: matcher,
        logo_square: matcher,
        logo_square_strict: matcher,
      }));
    });
    
  });

  test('the logos are available on the remote endpoint', async () => {
    const logosToCheck = Object.values(logos[0])
      .filter((logo: string | null) => logo?.startsWith(process.env.APEX_EXTEND_LOGOS_AWS_CLOUDFRONT_URL))
      .map(logo => axios.get(logo, { responseType: 'arraybuffer' }));

    expect.assertions(logosToCheck.length * 2 ?? 1);

    (await Promise.all(logosToCheck)).forEach(logo => {
      expect(logo.status).toBe(200);
      expect(logo.data.length).toBeGreaterThan(1);
    })
  })
});
