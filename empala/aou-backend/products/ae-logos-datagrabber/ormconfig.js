/* eslint @typescript-eslint/no-var-requires: "off" */
const { SnakeNamingStrategy } = require('typeorm-naming-strategies');

const dbConfig = {
  name: 'default',
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || '7432',
  username: 'postgres',
  password: 'postgres',
  database: process.env.DB_NAME || 'aou-local',
  synchronize: false,
  entities: ['../core-be/src/models/*.ts'],
  namingStrategy: new SnakeNamingStrategy()
};

module.exports = dbConfig;
