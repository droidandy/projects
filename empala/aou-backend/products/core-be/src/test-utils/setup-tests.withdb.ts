import dotenv from 'dotenv';

import {
  Connection, ConnectionOptions, createConnection, getConnectionOptions,
} from 'typeorm';
import { logger as testLogger } from './logger';

dotenv.config({
  path: '../../.env',
});

require('ts-node/register');

const sleep = (ms: number) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

const terminateConnections = async (conn: Connection, datnameList: string[], maxTryCount = 1) => {
  let tryCount = maxTryCount;
  const queryStr = `
    SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity
    WHERE (${datnameList.map((datname) => `pg_stat_activity.datname = '${datname}'`).join(' OR ')})
    AND pid <> pg_backend_pid();
  `;
  const infoStr = `Waiting for connections to ${datnameList.join(' and ')} to be terminated...`;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // if query return empty results, it may be that there are already no active connections
    // eslint-disable-next-line no-await-in-loop
    if ((await conn.query(queryStr)).length === 0) {
      // we do not trust the first successful result
      tryCount--;
      if (tryCount === 0) break;
    } else {
      tryCount = maxTryCount;
    }
    testLogger.info(`${infoStr} (${tryCount})`);
    // eslint-disable-next-line no-await-in-loop
    await sleep(2000);
  }
};

const setupTestEnvVariables = () => {
  process.env.NODE_ENV = 'test';
};

const setup = async () => {
  setupTestEnvVariables();
  const startTime = Date.now();
  const defaultConnectionOptions: ConnectionOptions = await getConnectionOptions();
  await createConnection({
    ...defaultConnectionOptions,
    type: 'postgres',
    database: 'postgres',
  }).then(async (conn) => {
    const result = await conn.query(`
      SELECT EXISTS(SELECT FROM pg_database WHERE datname = 'aou-test-template')
    `);
    if (result[0].exists) {
      await conn.query(`
        ALTER DATABASE "aou-test-template" WITH ALLOW_CONNECTIONS = true
      `);
    } else {
      await conn.query(`
        CREATE DATABASE "aou-test-template" WITH OWNER postgres ALLOW_CONNECTIONS = true
      `);
    }
    await conn.close();
  });
  await createConnection({
    ...defaultConnectionOptions,
    type: 'postgres',
    database: 'aou-test-template',
    migrationsRun: true,
  }).then(async (conn) => {
    await conn.close();
  });
  await createConnection({
    ...defaultConnectionOptions,
    type: 'postgres',
    database: 'postgres',
  }).then(async (conn) => {
    await terminateConnections(conn, ['aou-test-template'], 2);
    await conn.query(`
      ALTER DATABASE "aou-test-template" WITH ALLOW_CONNECTIONS = false
    `);
    await conn.close();
  });
  testLogger.info(`Created test template DB [${Date.now() - startTime} ms]`);
};

export default setup;
