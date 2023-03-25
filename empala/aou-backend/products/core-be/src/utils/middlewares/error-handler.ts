import { MiddlewareFn } from 'type-graphql';
import { CreateInvalidInputError } from '../../errors/create';
import { DeleteInvalidInputError } from '../../errors/delete';
import TransactionError from '../graphql/common';
import { generateCreateErrorMessage, generateDeleteErrorMessage } from '../error-message-generator';
import { logger } from '../../../../utils/src/logger';

export const CreateErrorHandler: MiddlewareFn<any> = async ({ context, info }, next) => {
  let result: typeof CreateInvalidInputError = null;
  try {
    result = await next();
  } catch (error) {
    logger.error(error);
    result = generateCreateErrorMessage(error, info.fieldName, context);
  }
  return result;
};

export const DeleteErrorHandler: MiddlewareFn<any> = async ({ context, info }, next) => {
  let result: typeof DeleteInvalidInputError = null;
  try {
    result = await next();
  } catch (error) /* istanbul ignore next */ {
    logger.error(error);
    result = generateDeleteErrorMessage(error, info.fieldName, context);
  }
  return result;
};

export const TransactionErrorHandler: MiddlewareFn<any> = async (_, next) => {
  try {
    return await next();
  } catch (error) {
    /* istanbul ignore else */
    if (error instanceof TransactionError) {
      logger.error(error);
      return error.graphQlError;
    }
    /* istanbul ignore next */
    throw error;
  }
};
