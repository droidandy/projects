/* eslint @typescript-eslint/no-var-requires: "off" */
const { SnakeNamingStrategy } = require('typeorm-naming-strategies');

const srcConfig = {
  name: 'default',
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || '7432',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'aou-local',
  synchronize: false,
  entities: ['src/models/*.ts'],
  migrations: ['db/migration/*.ts'],
  cli: {
    migrationsDir: 'db/migration',
  },
  namingStrategy: new SnakeNamingStrategy(),
  cache: true,
};

const srcConfigWithSSL = {
  name: 'default',
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || '7432',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'aou-local',
  synchronize: false,
  ssl: {
    ca: process.env.DB_CA_CERT,
  },
  entities: ['src/models/*.ts'],
  migrations: ['db/migration/*.ts'],
  cli: {
    migrationsDir: 'db/migration',
  },
  namingStrategy: new SnakeNamingStrategy(),
  cache: true,
};

const distConfig = {
  name: 'default',
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || '7432',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'aou-local',
  synchronize: false,
  entities: [`${__dirname}/dist/core-be/src/models/*.js`],
  migrations: [`${__dirname}/dist/core-be/db/migration/*.js`],
  cli: {
    migrationsDir: `${__dirname}/dist/core-be/db/migration`,
  },
  namingStrategy: new SnakeNamingStrategy(),
  cache: true,
};

const distConfigWithSSL = {
  name: 'default',
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || '7432',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'aou-local',
  synchronize: false,
  ssl: {
    ca: process.env.DB_CA_CERT,
  },
  entities: [`${__dirname}/dist/core-be/src/models/*.js`],
  migrations: [`${__dirname}/dist/core-be/db/migration/*.js`],
  cli: {
    migrationsDir: `${__dirname}/dist/core-be/db/migration`,
  },
  namingStrategy: new SnakeNamingStrategy(),
  cache: true,
};

// eslint-disable-next-line no-nested-ternary
module.exports = (process.env.TS_NODE || process.env.TS_NODE_DEV || process[Symbol.for('ts-node.register.instance')])
  ? (process.env.DB_CA_CERT ? srcConfigWithSSL : srcConfig)
  : (process.env.DB_CA_CERT ? distConfigWithSSL : distConfig);
