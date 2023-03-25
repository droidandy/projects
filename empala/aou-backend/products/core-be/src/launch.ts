import { ApolloServer } from 'apollo-server';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import { logger } from '../../utils/src/logger';
import { authenticate } from './security/authentication';
import { UserIdPropagator } from './utils/middlewares/userid-propagator';
import { authChecker } from './security/auth-checker';
import { IContext } from './utils/context-interface';
import { RequestId } from './utils/middlewares/request-id';
import { ApolloLogger, ExtendedGraphQLError, formatAndLogErrorResponse } from './utils/apollo-logger';

const runService = async () => {
  const schema = await buildSchema({
    resolvers: [`${__dirname}/resolvers/**/*.{ts,js}`],
    authChecker,
    globalMiddlewares: [RequestId, UserIdPropagator],
  });
  const server = new ApolloServer({
    schema,
    context: async ({ req }) => {
      const metadata: any = await authenticate(req.headers.authorization, req.body?.operationName === 'IntrospectionQuery');
      metadata.userDevice = req.headers['user-agent'] || 'unknown device';
      const context: IContext = {
        metadata,
      };
      return context;
    },
    plugins: [new ApolloLogger()],
    formatError: (error: ExtendedGraphQLError) => formatAndLogErrorResponse(error),
  });

  if (process.env.NODE_ENV === 'development') {
    logger.info('Initializing DB');
    await createConnection();
    logger.info('Connected to DB');
  }

  const port = process.env.PORT || 3000;
  await server.listen({ port }).then(({ url }) => {
    logger.info(`🚀  Apollo Server ready at ${url}`);
  });
};

runService();

export default runService;
