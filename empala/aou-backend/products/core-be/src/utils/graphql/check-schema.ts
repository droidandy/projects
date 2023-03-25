import { ApolloServer } from 'apollo-server';
import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { logger } from '../../../../utils/src/logger';

const schemaFileName = process.argv.slice(2)[0];

let schema = null;

try {
  schema = loadSchemaSync(schemaFileName, { loaders: [new GraphQLFileLoader()] });
} catch (e) {
  logger.error(e);
}

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.

const server = new ApolloServer({ schema });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  logger.info(`🚀  Server ready at ${url}`);
});
