/* istanbul ignore file */
import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { Settings } from 'luxon';
import config from './lib/config';

Settings.defaultZone = config.apexExtracts.defaultTimezone;

// Here an attempt is made to load environment variables first from <aou-backend>/.env,
// and if there is no such file, then from <aou-backend>/products/apex-ext-datagrabber/.env
const envFile = path.resolve(`${process.cwd()}../../.env`);
const dotenvConfigOptions = fs.existsSync(envFile) ? { path: envFile } : undefined;
dotenv.config(dotenvConfigOptions);
