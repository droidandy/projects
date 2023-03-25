import 'reflect-metadata';
import fs = require('fs');
import { buildSchema } from 'type-graphql';
import { printSchema } from 'graphql';
import { authChecker } from '../../security/auth-checker';
import { logger } from '../../../../utils/src/logger';

(async () => {
  const schema = await buildSchema({ resolvers: [`${__dirname}/../../resolvers/**/*.{ts,js}`], authChecker });
  const schemaFileName = process.argv.slice(2)[0];
  const sdl = printSchema(schema);
  fs.writeFile(schemaFileName, sdl, (err) => {
    if (err) {
      logger.error(err);
    }
  });
})();
