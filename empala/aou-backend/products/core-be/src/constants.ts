/* istanbul ignore if */
if (!/^\d{1,4}$/.test(process.env.INSTRUMENT_CACHE_LOADING_BATCH_SIZE)) {
  throw new Error(`Incorrect value of the environment variable INSTRUMENT_CACHE_LOADING_BATCH_SIZE: "${
    process.env.INSTRUMENT_CACHE_LOADING_BATCH_SIZE}". Expected number from 0 to 9999`);
}
export const INSTRUMENT_CACHE_LOADING_BATCH_SIZE = Number(process.env.INSTRUMENT_CACHE_LOADING_BATCH_SIZE);

/* istanbul ignore if */
if (!/^["']?\d\d[-:]\d\d["']?$/.test(process.env.INSTRUMENT_CACHE_RELOAD_UTC_TIME)) {
  throw new Error(`Incorrect value of the environment variable INSTRUMENT_CACHE_RELOAD_UTC_TIME: "${
    process.env.INSTRUMENT_CACHE_RELOAD_UTC_TIME}". Expected time in HH-mm format`);
}
export const INSTRUMENT_CACHE_RELOAD_UTC_TIME = process.env.INSTRUMENT_CACHE_RELOAD_UTC_TIME
  .replace('-', ':')
  .replace(/["']/g, '');

/* istanbul ignore if */
if (!process.env.APEX_EXTEND_TRADE_API_KEY) {
  throw new Error('Missing value of environment variable APEX_EXTEND_TRADE_API_KEY');
}

/* istanbul ignore if */
if (!process.env.APEX_EXTEND_TRADE_API_ENTITY) {
  throw new Error('Missing value of environment variable APEX_EXTEND_TRADE_API_ENTITY');
}

/* istanbul ignore if */
if (!process.env.APEX_EXTEND_TRADE_API_GROUP) {
  throw new Error('Missing value of environment variable APEX_EXTEND_TRADE_API_GROUP');
}

/* istanbul ignore if */
if (!process.env.APEX_EXTEND_TRADE_API_URL) {
  throw new Error('Missing value of environment variable APEX_EXTEND_TRADE_API_URL');
}

/* istanbul ignore if */
if (!process.env.APEX_EXTEND_APPLICATIONS_URL) {
  throw new Error('Missing value of environment variable APEX_EXTEND_APPLICATIONS_URL');
}

/* istanbul ignore if */
if (!process.env.APEX_EXTEND_APPLICATIONS_ADMIN_API_KEY) {
  throw new Error('Missing value of environment variable APEX_EXTEND_APPLICATIONS_ADMIN_API_KEY');
}

/* istanbul ignore if */
if (!process.env.APEX_EXTEND_APPLICATIONS_ADMIN_API_SECRET) {
  throw new Error('Missing value of environment variable APEX_EXTEND_APPLICATIONS_ADMIN_API_SECRET');
}

/* istanbul ignore if */
if (!process.env.APEX_EXTEND_TRADE_ACCOUNT_ID) {
  throw new Error('Missing value of environment variable APEX_EXTEND_TRADE_ACCOUNT_ID');
}

/* istanbul ignore if */
if (!process.env.APEX_EXTEND_APPLICATIONS_USER_ID) {
  throw new Error('Missing value of environment variable APEX_EXTEND_APPLICATIONS_USER_ID');
}
