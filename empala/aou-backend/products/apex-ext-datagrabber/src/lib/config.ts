/*
The module
- checks for required configuration parameters
- normalizes parameter values
- fills in additional configuration properties
- returns checked and enriched config
 */

import { Buffer } from 'buffer';
import * as _ from 'lodash';
import config from 'config';
import { exitOnError } from './logger';

const cfg = config.util.toObject();

const mustBeNumeric = [
  'instrumentsPerUpsert',
  'pricesPerInsert',
  'apexExtracts.daysBeforeCurrent',
  'apexExtracts.sftp.port',
  'apexExtracts.sftp.retriesOptions.retries',
  'apexExtracts.sftp.retriesOptions.minTimeout',
  'apexExtracts.sftp.retriesOptions.maxTimeout',
];

const mandatory = [
  'apexExtracts.defaultTimezone',
  'apexExtracts.sftp.host',
  'apexExtracts.sftp.username',
  'apexExtracts.sftp.privateKey',
  'apexExtend.applicationsUrl',
];

const { parsed: envMap } = config.util.getConfigSources()
  .find(({ name }) => name.includes('custom-environment-variables'));

[...mandatory, ...mustBeNumeric].forEach((propertyPath) => {
  /* istanbul ignore if */
  if (!config.has(propertyPath) || !config.get(propertyPath)) {
    let envName: string = _.get(envMap, propertyPath);
    envName = envName ? ` (or env: ${envName})` : '';
    exitOnError(`Configuration parameter "${propertyPath}${envName}" is not provided`);
  }
});

mustBeNumeric.forEach((propertyPath) => {
  const value: string | number = config.has(propertyPath) && config.get(propertyPath);
  /* istanbul ignore if */
  if (!/^\d+$/.test(String(value))) {
    let envName: string = _.get(envMap, propertyPath);
    envName = envName ? ` (or env: ${envName})` : '';
    exitOnError(`The configuration parameter "${propertyPath}${envName}" is of non-numeric type (value = ${value})`);
  }
  _.set(cfg, propertyPath, Number(value));
});

const { sftp } = cfg.apexExtracts;
sftp.privateKey = (Buffer.from(sftp.privateKey, 'base64')).toString();

/* istanbul ignore next */
if (!(process.env.NODE_ENV || '').includes('test')) {
  config.util.makeImmutable(cfg);
}

export default cfg;
