import {
  ConnectionOptions, createConnection, getConnection, getConnectionOptions,
} from 'typeorm';
import { logger } from './logger';

const connection = {
  create: async () => {
    const startTime = Date.now();
    const defaultConnectionOptions: ConnectionOptions = await getConnectionOptions();
    await createConnection({
      ...defaultConnectionOptions,
      type: 'postgres',
      database: 'postgres',
    }).then(async (conn) => {
      await conn.query(`
        DROP DATABASE IF EXISTS "aou-test"
      `);
      await conn.query(`
        CREATE DATABASE "aou-test" WITH TEMPLATE "aou-test-template" OWNER postgres
      `);
      await conn.close();
    });
    await createConnection({
      ...defaultConnectionOptions,
      type: 'postgres',
      database: 'aou-test',
    });
    logger.info(`Created clean test DB [${Date.now() - startTime} ms]`);
  },

  close: async () => {
    await getConnection().close();
  },

  creationTimeoutMs: 20000,
};
export default connection;
