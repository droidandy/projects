const BFF_URL = process.env.BFF_URL ? process.env.BFF_URL : 'http://localhost:5000';
const CATALOG_URL = process.env.CATALOG_URL
  ? process.env.CATALOG_URL
  : 'http://api.catalog-latest.marketplace.dev.bankauto.lo';
const CLIENT_ID = process.env.CLIENT_ID ? process.env.CLIENT_ID : 'application.marketplace';
const ENVS = {
  PRODUCTION: 'production',
  STAGING: 'staging',
  DEVELOPMENT: 'development',
};
const CURRENT_ENV = process.env.CURRENT_ENV || ENVS.DEVELOPMENT;
module.exports = {
  BFF_URL,
  CATALOG_URL,
  CLIENT_ID,
  CURRENT_ENV,
  ENVS,
};
