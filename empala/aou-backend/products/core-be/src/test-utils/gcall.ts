import shortUUID from 'short-uuid';
import { graphql } from 'graphql';
import { Maybe } from 'graphql/jsutils/Maybe';
import { buildSchema, MiddlewareFn } from 'type-graphql';
import { EAccessRole, authChecker } from '../security/auth-checker';
import { UserIdPropagator } from '../utils/middlewares/userid-propagator';
import { ResolverData } from '../utils/middlewares/request-id';

interface Options {
  source: string;
  variableValues?: Maybe<{ [key: string]: any }>;
  contextValue?: Maybe<{ [key: string]: any }>;
  graphQLErrorExpected?: boolean;
}

const RequestId: MiddlewareFn = async (params: ResolverData, next) => {
  params.context.requestId = params.context.requestId || shortUUID.generate();
  return next();
};

export const gCall = async ({
  source, variableValues, contextValue, graphQLErrorExpected,
}: Options) => {
  if (!contextValue || !('metadata' in contextValue)) {
    contextValue = {
      metadata: { role: EAccessRole.READONLY_ADMIN },
    };
  }
  const result = await graphql({
    schema: await buildSchema({
      resolvers: [`${__dirname}/../resolvers/**/*.{ts,js}`],
      authChecker,
      globalMiddlewares: [UserIdPropagator, RequestId],
    }),
    source,
    variableValues,
    contextValue: {
      ...contextValue,
    },
  });

  if (!graphQLErrorExpected && result.errors && result.errors.length) { throw new Error(`GraphQL error for: ${source}:\n${result.errors[0].toString()}`); }
  return result;
};
