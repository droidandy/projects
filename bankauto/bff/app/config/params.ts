export const USER_URL = process.env.USER_URL ?? 'http://users-def.marketplace.dev.bankauto.lo';
export const DIR_URL = process.env.DIR_URL ?? 'http://api.catalog-def.marketplace.dev.bankauto.lo';
export const APPLICATION_URL = process.env.APPLICATION_URL ?? 'http://application-def.marketplace.dev.bankauto.lo';
export const BILLING_URL = process.env.BILLING_URL ?? 'http://billing-latest.marketplace.dev.bankauto.lo/api';
export const MARKETPLACE_URL = process.env.MARKETPLACE_URL ?? 'http://localhost:3000';
export const DEALER_OFFICE_URL = process.env.DEALER_OFFICE_URL ?? 'http://localhost:3001';
export const BLOG_URL = process.env.BLOG_URL ?? 'http://localhost:3002';
export const OKP_URL = process.env.OKP_URL ?? 'http://localhost:3000';
export const DADATA_URL = process.env.DADATA_URL ?? 'https://suggestions.dadata.ru/suggestions/api/4_1/rs';
export const CURRENT_ENV = process.env.K8S_ENVIRONMENT;

export const SERVER_AUTH_PASSWORD = 'MHAZBOvYXgS29oxk'; // TODO replace by process.envs
export const DADATA_TOKEN = '50ec6ae0336b066a08c6153c6f4c4762fd42d187';

export const ENVS = {
  PRODUCTION: 'production',
  STAGING: 'staging',
  DEVELOPMENT: 'development',
  TEST: 'test',
};
