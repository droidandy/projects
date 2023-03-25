import * as path from 'path';
import 'dotenv/config';
import 'config';

process.env.NODE_CONFIG_DIR = path.resolve(`${process.cwd()}/config/`)
  + path.delimiter
  + path.resolve(`${process.cwd()}/../../config/`);
