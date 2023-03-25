import { existsSync, mkdirSync, PathOrFileDescriptor } from 'fs';
import { ApolloServerPlugin, GraphQLRequestContext } from 'apollo-server-plugin-base';
import shortUUID from 'short-uuid';
import { GraphQLError } from 'graphql';
import { logger, getToFileLogger } from '../../../utils/src/logger';

const SLOW_REQUEST_THRESHOLD_MILLIS = Number(process.env.SLOW_REQUESTS_TRESHOLD_SECONDS) * 1000 || 5 * 1000;

export interface ExtendedGraphQLError extends GraphQLError {
  message: any;
  extensions: { [key: string]: any } | undefined;
  requestId?: string;
}

export interface ExtendedGraphQLRequestContext extends GraphQLRequestContext {
  errors?: ExtendedGraphQLError[];
  requestId?: string;
}

const LOGS_DIR = `${__dirname}/../../logs`;
if (!existsSync(LOGS_DIR)) {
  mkdirSync(LOGS_DIR);
}
const AUTH_ERRORS_LOG_FILE_NAME: PathOrFileDescriptor = `${LOGS_DIR}/auth_errors.log`;
const AUTH_ERRORS_LOGGER = getToFileLogger(AUTH_ERRORS_LOG_FILE_NAME, 'error');

// There are 2 limitations with error handling with Apollo Server
// 1. Apollo's plugins cannot catch errors with context creation(in our case it's problem with auth), https://github.com/apollographql/apollo-server/issues/3223
// 2. Apollo Server constructor's formatError method can catch all errors, including context errors, but doesn't have graphql context info
// In order to deal with both problems, in plugin's didEncounterErrors event we add request info and requestId into the only non-read-only field error.message
// Resulting error.extensions object will contain original extensions fields and requestId, message will become original error message
export const formatAndLogErrorResponse = (error: ExtendedGraphQLError): ExtendedGraphQLError => {
  if (!error.extensions) {
    error.extensions = {};
  }
  let currentLogger;
  if (error.extensions.isIntrospectionQuery !== true) {
    currentLogger = error.extensions.code === 'UNAUTHENTICATED' ? AUTH_ERRORS_LOGGER : logger;
  }
  if (typeof error.message === 'string') {
    const requestId = shortUUID.generate();
    error.extensions.requestId = requestId;
    if (currentLogger) {
      const requestLogger = currentLogger.getChildLogger({ requestId });
      requestLogger.error('Apollo Server throws error outside of request context', error.message, error);
    }
  } else {
    if (currentLogger) {
      const msg = error.message;
      currentLogger.error(`Operation ${msg.operation} with requestId=${msg.requestId} and userId=${msg.userId} failed.
          \nQuery: ${msg.query}\nVariables:`, msg.variables, '\nError: ', error);
    }
    error.extensions.requestId = error.message.requestId;
    error.message = error.message.message;
  }
  return error;
};

export class ApolloLogger implements ApolloServerPlugin {
  public async requestDidStart(ctx: ExtendedGraphQLRequestContext): Promise<any> {
    const start = Date.now();
    let op: string;

    ctx.context.requestId = ctx.requestId || shortUUID.generate();

    return {
      didResolveOperation: (context: GraphQLRequestContext) => {
        op = context.operationName;
      },
      willSendResponse: (context: GraphQLRequestContext) => {
        const stop = Date.now();
        const elapsed = stop - start;
        if (elapsed > SLOW_REQUEST_THRESHOLD_MILLIS && op !== 'IntrospectionQuery') {
          logger.warn(`Operation ${op} with requestId=${context.context.requestId} and userId=${context.context.metadata?.user?.id} completed in ${elapsed} ms.
          \nQuery: ${context.request.query}\nVariables:`, context.request.variables);
        }
      },
      didEncounterErrors: (context: ExtendedGraphQLRequestContext) => {
        context.errors.forEach((error: ExtendedGraphQLError) => {
          const msg = error.message;
          error.message = {
            operation: op,
            query: context.request.query,
            variables: context.request.variables,
            requestId: context.context.requestId,
            userId: context.context?.metadata?.user?.id,
            message: msg,
          };
        });
      },
    };
  }
}
